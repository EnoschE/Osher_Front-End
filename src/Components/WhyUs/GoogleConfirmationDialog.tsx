import { Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { CheckOutlined } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import CustomButton from "../Common/CustomButton";
import useLoginStyles from "../Login/loginStyles";

interface GoogleConfirmationDialogProps {
  open: boolean;
  onClose?: () => void;
}

const GoogleConfirmationDialog = ({
  open,
  onClose,
}: GoogleConfirmationDialogProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <CheckOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        User account created
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={32}
        color='text.secondary'
      >
        Please double-check the user information in your account settings to
        make sure that it is up-to-date. This information is essential for your
        contract!
      </Typography>

      <CustomButton fullWidth onClick={onClose} sx={{ mb: 10 }}>
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default GoogleConfirmationDialog;
