import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { PersonRemoveOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import CustomDropdown from "../Common/CustomDropdown";
import {
  assignCompany,
  getAllInstallerCompanies,
} from "../../Services/dashboardService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  activeUser: { text: string; id: string } | null;
  onSuccess?: () => void;
  companyId?: string;
}

const AssignCompanyDialog = ({
  open,
  onClose,
  activeUser,
  onSuccess: onSuccess,
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
      let { data }: any = await getAllInstallerCompanies();
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
      const payload = {
        userId: activeUser?.id,
        installerCompanyId: selectedId,
      };
      await assignCompany(payload);

      await onSuccess?.();

      onClose?.();
      toast.success(`Installer company assigned successfully!`);
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
        <PersonRemoveOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Assign Installer Company
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Please select a company to assign to {activeUser?.text}?
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

export default AssignCompanyDialog;
