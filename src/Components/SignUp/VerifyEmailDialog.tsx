import { Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { EmailOutlined } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import CustomButton from "../Common/CustomButton";
import useLoginStyles from "../Login/loginStyles";

interface VerifyEmailDialogProps {
  open: boolean;
  onClose?: () => void;
}

const VerifyEmailDialog = ({ open, onClose }: VerifyEmailDialogProps) => {
  const { IconSquareBox } = useLoginStyles();
  const colors = useSelector(selectColors);

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <EmailOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Verify your Email
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={32}
        color='text.secondary'
      >
        We've sent you an email to complete your registration.
        <br />
        Tip: Please check your spam folder in case the email was mistakenly
        filtered.
      </Typography>

      <CustomButton fullWidth onClick={onClose} sx={{ mb: 10 }}>
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default VerifyEmailDialog;
