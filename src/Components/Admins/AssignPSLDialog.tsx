import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { PersonAddOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import CustomDropdown from "../Common/CustomDropdown";
import {
  getAllAdminManagers,
  getAllDirectors,
  getAllManagersForPSL,
  getAllPSLsForAdminManager,
  getAllRepresentativesForPSL,
} from "../../Services/dashboardService";
import {
  assignInstallerManagerToPSL,
  assignPSLToManager,
  assignRepresentativeToPSL,
} from "../../Services/directorService";
import { useSelector } from "../../Redux/reduxHooks";

import { selectColors } from "../../Redux/Slices/generalSlice";
interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  activeUser: { name: string; _id: string } | null;
  onSuccess?: () => void;
  companyId?: string;
  type?:
    | "Admin Manager"
    | "PSL"
    | "Director"
    | "Representative"
    | "Installer Manager";
}

const AssignPSLDialog = ({
  open,
  onClose,
  activeUser,
  onSuccess: onSuccess,
  type,
}: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  const [allCompanies, setAllCompanies] = useState<Array<any>>([]);

  useEffect(() => {
    if (open) {
      getAllUsers();
    }
  }, [open]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let { data }: any =
        type === "Admin Manager"
          ? await getAllAdminManagers()
          : type === "Director"
          ? await getAllDirectors()
          : type === "Representative"
          ? await getAllRepresentativesForPSL()
          : type === "Installer Manager"
          ? await getAllManagersForPSL()
          : await getAllPSLsForAdminManager();
      data = data.map((item: any) => ({
        ...item,
        value: item._id,
        text: item.name,
      }));
      setAllCompanies(data);

      setSelectedId("");
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      if (type === "Admin Manager") {
        const payload = {
          pslId: selectedId,
          adminManagerId: activeUser?._id,
        };
        await assignPSLToManager(payload);
      } else if (type === "Director") {
        const payload = {
          pslId: selectedId,
          adminManagerId: activeUser?._id,
        };
        await assignPSLToManager(payload);
      } else if (type === "Representative") {
        const payload = {
          representativeId: selectedId,
          pslId: activeUser?._id,
        };
        await assignRepresentativeToPSL(payload);
      } else if (type === "Installer Manager") {
        const payload = {
          installerManagerId: selectedId,
          pslId: activeUser?._id,
        };
        await assignInstallerManagerToPSL(payload);
      } else {
        const payload = {
          pslId: selectedId,
          adminManagerId: activeUser?._id,
        };
        await assignPSLToManager(payload);
      }

      await onSuccess?.();

      onClose?.();
      toast.success(`${type || "PSL"} assigned successfully!`);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleDropdown = (value: string) => {
    setSelectedId(value);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <PersonAddOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Assign {type || "PSL"}
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Please select a {type || "PSL"} to assign to {activeUser?.name}?
      </Typography>

      <CustomDropdown
        options={allCompanies}
        value={selectedId}
        onChange={handleDropdown}
        minWidth='100%'
        label='Select option'
      />

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
          disabled={!selectedId || loading}
          onClick={handleAssign}
        >
          Assign
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default AssignPSLDialog;
