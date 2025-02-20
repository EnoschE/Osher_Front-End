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
  getAllUnassignedCustomersByCompanyId,
  assignRepresentative,
} from "../../Services/dashboardService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  representative: {
    name: string;
    text: string;
    _id: string;
    companyId: string;
  } | null;
  onSuccess?: () => void;
}

const AssignCustomerDialog = ({
  open,
  onClose,
  representative,
  onSuccess: onSuccess,
}: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  const [allTechnicians, setAllTechnicians] = useState<Array<any>>([]);

  useEffect(() => {
    if (open) getAllUsers();
  }, [open]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let { data }: any = await getAllUnassignedCustomersByCompanyId(
        representative?.companyId || ""
      );

      data = data.map((item: any) => ({
        ...item,
        value: item._id,
        text: item.name,
      }));
      setAllTechnicians(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: selectedId,
        installerId: representative?._id,
        // installerId: representative?.mongoId,
      };
      await assignRepresentative(selectedId || "", payload);

      await onSuccess?.();

      onClose?.();
      toast.success(`Customer assigned successfully!`);
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
        Assign Customer
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Please select a customer to assign to {representative?.name}?
      </Typography>

      <CustomDropdown
        options={allTechnicians}
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

export default AssignCustomerDialog;
