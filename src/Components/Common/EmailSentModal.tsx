import { EmailOutlined } from "@mui/icons-material";
import useLoginStyles from "../Login/loginStyles";
import CustomDialog from "./CustomDialog";
import { Typography } from "@mui/material";
import CustomButton from "./CustomButton";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface VerifyEmailSentDialogProps {
  open: boolean;
  onClose?: () => void;
}

const EmailSentDialog = ({ open, onClose }: VerifyEmailSentDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <EmailOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Email Sent
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={10}
        color='text.secondary'
      >
        We've sent an email to complete registration.
      </Typography>
      <Typography fontSize={12} mb={32} textAlign='center'>
        Tip: Please check your spam folder in case the email was mistakenly
        filtered.
      </Typography>

      <CustomButton fullWidth onClick={onClose} sx={{ mb: 10 }}>
        Close
      </CustomButton>
    </CustomDialog>
  );
};
export default EmailSentDialog;
