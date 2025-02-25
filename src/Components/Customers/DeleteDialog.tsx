import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { DeleteOutline } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  user: { name: string };
  userType:
    | "Brand"
    | "Admin"
    | "Customer"
    | "Technician"
    | "Installer"
    | "Utility Company"
    | "Installation Crew";
}

const DeleteDialog = ({
  open,
  onClose,
  userType,
  onDelete,
  user,
}: ForgotPasswordDialogProps) => {
  const { IconSquareBox } = useLoginStyles();
  userType = userType === "Technician" ? "Installation Crew" : userType;

  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete?.();
    } catch (error: any) {
      toast.error(error);
    }
    onClose?.();
    setLoading(false);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <DeleteOutline />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Delete {userType}
      </Typography>
      <Typography fontSize={16} textAlign='center' color='text.secondary'>
        Are you sure you want to delete the account of {user.name}?
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
        <CustomButton fullWidth disabled={loading} onClick={handleDelete}>
          Delete
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default DeleteDialog;
