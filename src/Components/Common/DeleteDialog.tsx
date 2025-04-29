import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { DeleteOutline } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import { UserRoleType } from "../../Utils/types";
import { useTranslation } from "react-i18next";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  user: { name: string };
  userType: UserRoleType;
}

const DeleteDialog = ({
  open,
  onClose,
  userType,
  onDelete,
  user,
}: ForgotPasswordDialogProps) => {
  const { t } = useTranslation();
  const { IconSquareBox } = useLoginStyles();

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
        {t("Delete")} {userType}
      </Typography>
      <Typography fontSize={16} textAlign='center' color='text.secondary'>
        {t("Are you sure you want to delete ")}
        {["Post", "Ad"].includes(userType) ? "" : t("the account of")}
        {` ${user.name}`}?
      </Typography>

      <Box display='grid' gridTemplateColumns='1fr 1fr' gap={10} mt={32}>
        <CustomButton
          variant='outlined'
          fullWidth
          disabled={loading}
          onClick={onClose}
        >
          {t("Cancel")}
        </CustomButton>
        <CustomButton fullWidth disabled={loading} onClick={handleDelete}>
          {t("Delete")}
        </CustomButton>
      </Box>
    </CustomDialog>
  );
};

export default DeleteDialog;
