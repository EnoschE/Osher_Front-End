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
  changeTechnician,
  getAllTechnicians,
} from "../../Services/dashboardService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  unassignedCustomer: { text: string; id: string } | null;
  currentTechnician?: { _id: string; name: string } | null;
  onUnassign?: () => void;
}

const UnassignTechnicianDialog = ({
  open,
  onClose,
  unassignedCustomer,
  currentTechnician,
  onUnassign,
}: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(
    ""
  );
  const [allTechnicians, setAllTechnicians] = useState<Array<any>>([]);

  useEffect(() => {
    if (open) getAllUsers();
  }, [currentTechnician, open]);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let { data }: any = await getAllTechnicians();
      data = data.map((item: any) => ({
        ...item,
        value: item._id,
        text: item.name,
      }));
      setAllTechnicians(data);
      setCurrentSelection(currentTechnician?._id);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleUnassign = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: unassignedCustomer?.id,
        technicianId: currentSelection,
      };
      await changeTechnician(unassignedCustomer?.id || "", payload);
      await onUnassign?.();
      onClose?.();
      toast.success("Customer unassigned successfully!");
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleDropdown = (value: string) => {
    setCurrentSelection(value);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <PersonRemoveOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Replace Installation Crew
      </Typography>
      <Typography
        fontSize={16}
        mb={16}
        textAlign='center'
        color='text.secondary'
      >
        Are you sure you want to replace installation crew of{" "}
        {unassignedCustomer?.text}?
      </Typography>

      <CustomDropdown
        options={allTechnicians}
        value={currentSelection}
        onChange={handleDropdown}
        minWidth='100%'
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
          disabled={currentSelection === currentTechnician?._id || loading}
          onClick={handleUnassign}
        >
          Confirm
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default UnassignTechnicianDialog;
