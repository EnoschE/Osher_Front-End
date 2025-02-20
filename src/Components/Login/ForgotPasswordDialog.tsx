import { Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { EmailOutlined, KeyOutlined } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import CustomTextField from "../Common/CustomTextField";
import CustomButton from "../Common/CustomButton";
import { allRoutes } from "../../Routes/AllRoutes";
import { useNavigate } from "react-router-dom";
import useLoginStyles from "./loginStyles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as EmailValidator from "email-validator";
import { sendResetPasswordLink } from "../../Services/passwordService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
}

const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const navigate = useNavigate();
  const { IconSquareBox } = useLoginStyles();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const isGmail = email.includes("@gmail.com");
  const isOutlook =
    email.includes("@live.com") ||
    email.includes("@hotmail.com") ||
    email.includes("@outlook.com");

  useEffect(() => {
    if (open) {
      setEmail("");
      setError("");
      setEmailSent(false);
    }
  }, [open]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    validateEmail(value);
  };

  const validateEmail = (currentValue = "") => {
    const updatedError = currentValue
      ? !EmailValidator.validate(currentValue)
        ? "Enter a valid email"
        : ""
      : "Email cannot be empty";

    setError(updatedError);
    return !!updatedError;
  };

  const handleSendLink = async () => {
    if (validateEmail(email)) return;

    setLoading(true);
    try {
      const { data } = await sendResetPasswordLink(email);
      // TODO: inform Shahmeer to fix the api response

      if (data.resetlink === "user with given email doesn't exist") {
        toast.error("User with given email doesn't exist");
        setError("Email address not found in our records");
      } else {
        setEmailSent(true);
        toast.success("Password reset link has been sent!");
      }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleOpenEmailApp = () => {
    let url = "";
    if (isGmail) url = "https://mail.google.com";
    else if (isOutlook) url = "https://outlook.com";
    window.open(url, "_blank");
  };

  const handleSignInClick = () => {
    if (emailSent) {
      handleSendLink();
    } else {
      navigate(allRoutes.HOME);
      onClose?.();
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        {emailSent ? <EmailOutlined /> : <KeyOutlined />}
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        {emailSent ? "Check your email" : "Forgot password?"}
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={emailSent ? 6 : 32}
        color='text.secondary'
      >
        {emailSent
          ? "We've sent you a password reset link"
          : "No worries we’ll send you reset instructions"}
      </Typography>
      {emailSent && (
        <Typography variant='body2' textAlign='center' mb={32}>
          {email || "test@sungroup.com"}
        </Typography>
      )}

      {!emailSent && (
        <CustomTextField
          autoFocus
          label='Email'
          type='email'
          bottom={24}
          value={email}
          onChange={handleChangeEmail}
          error={error}
        />
      )}

      {emailSent ? (
        (isGmail || isOutlook) && (
          <CustomButton
            fullWidth
            disabled={loading}
            onClick={handleOpenEmailApp}
          >
            Open email app
          </CustomButton>
        )
      ) : (
        <CustomButton fullWidth disabled={loading} onClick={handleSendLink}>
          Send Now
        </CustomButton>
      )}
      <Typography
        fontSize={12}
        color='text.secondary'
        textAlign='center'
        mt={32}
        mb={10}
      >
        {emailSent ? "Didn’t receive the email? " : "Remember your password? "}
        <span
          className='link'
          onClick={handleSignInClick}
          style={{ fontWeight: 600 }}
        >
          {emailSent ? "Click to resend" : "Sign In"}
        </span>
      </Typography>
    </CustomDialog>
  );
};

export default ForgotPasswordDialog;
