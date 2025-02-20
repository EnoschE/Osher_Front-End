import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { PersonRemoveOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import {
  assignInstallerManagerToPSL,
  assignPSLToManager,
  assignRepresentativeToPSL,
} from "../../Services/directorService";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { useSelector } from "../../Redux/reduxHooks";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  activeUser: { name: string; _id: string } | null;
  onSuccess?: () => void;
  companyId?: string;
  selected?: { id: string; name: string };
  type?:
    | "Admin Manager"
    | "PSL"
    | "Director"
    | "Representative"
    | "Installer Manager";
}

const UnassignPSLDialog = ({
  open,
  onClose,
  activeUser,
  onSuccess: onSuccess,
  type,
  selected: selected,
}: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [loading, setLoading] = useState<boolean>(false);

  const handleAssign = async () => {
    setLoading(true);
    try {
      if (type === "Admin Manager") {
        const payload = {
          pslId: selected?.id,
          adminManagerId: activeUser?._id,
        };
        await assignPSLToManager(payload);
      } else if (type === "Director") {
        const payload = {
          pslId: selected?.id,
          adminManagerId: activeUser?._id,
        };
        await assignPSLToManager(payload);
      } else if (type === "Representative") {
        const payload = {
          representativeId: selected?.id,
          pslId: "",
        };
        await assignRepresentativeToPSL(payload);
      } else if (type === "Installer Manager") {
        const payload = {
          installerManagerId: selected?.id,
          pslId: "",
        };
        await assignInstallerManagerToPSL(payload);
      } else {
        const payload = {
          pslId: selected?.id,
          adminManagerId: "",
        };
        await assignPSLToManager(payload);
      }

      await onSuccess?.();

      onClose?.();
      toast.success(`${type || "PSL"} unassigned successfully!`);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <PersonRemoveOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Unassign {type || "PSL"}
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Are you sure to unassign <b>{selected?.name?.trim() || type}</b>?
      </Typography>

      <Box display='grid' gridTemplateColumns='1fr 1fr' gap={10} mt={32}>
        <CustomButton
          variant='outlined'
          fullWidth
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </CustomButton>
        <CustomButton
          fullWidth
          disabled={!selected || loading}
          onClick={handleAssign}
        >
          Confirm
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default UnassignPSLDialog;
