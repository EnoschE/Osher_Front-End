import { Box, Typography } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import {
  ArrowBack,
  CheckCircle,
  CheckCircleOutline,
  LockOutlined,
} from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import CustomTextField from "../Common/CustomTextField";
import CustomButton from "../Common/CustomButton";
import { allRoutes } from "../../Routes/AllRoutes";
import { useNavigate } from "react-router-dom";
import useLoginStyles from "../Login/loginStyles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../../Services/passwordService";

interface PasswordDataProps {
  password: string;
  confirmPassword: string;
}

interface SetPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
  token?: string;
  userId?: string;
}

const containsSpecialCharacter = (password: string) => {
  const specialCharacterRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
  return specialCharacterRegex.test(password);
};

const SetPasswordDialog = ({
  open,
  onClose,
  token = "",
  userId = "",
}: SetPasswordDialogProps) => {
  const colors = useSelector(selectColors);
  const navigate = useNavigate();
  const { IconSquareBox } = useLoginStyles();

  const [data, setData] = useState<PasswordDataProps>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordDataProps>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordSet, setPasswordSet] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setData({ password: "", confirmPassword: "" });
      setErrors({ password: "", confirmPassword: "" });
      setPasswordSet(false);
    }
  }, [open]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.password = data.password ? "" : "Password cannot be empty";
    updatedErrors.confirmPassword = data.confirmPassword
      ? data.confirmPassword !== data.password
        ? "Confirm password must be equal to password"
        : ""
      : "Confirm password cannot be empty";

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).find(Boolean);
  };

  const handleResetPassword = async () => {
    if (!validateData()) return;

    setLoading(true);
    try {
      const passwordData = {
        newpassword: data.password,
        confirmpassword: data.confirmPassword,
      };

      // const { data: res } = await resetPassword(token, passwordData);
      await resetPassword(userId, token, passwordData);

      // if (res.resetlink === "user with given email doesn't exist") {
      // 	toast.error("user with given email doesn't exist");
      // } else {
      setPasswordSet(true);
      toast.success("Password reset successfully!");
      // }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigate(allRoutes.HOME);
    onClose?.();
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        {passwordSet ? <CheckCircleOutline /> : <LockOutlined />}
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        {passwordSet ? "Check your email" : "Set new password"}
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={32}
        color='text.secondary'
      >
        {passwordSet
          ? "Your password has bee successfully reset click below to log in magically."
          : "Your new password must be different to previously used passwords."}
      </Typography>

      {!passwordSet && (
        <>
          <CustomTextField
            autoFocus
            name='password'
            label='Password'
            type='password'
            bottom={16}
            value={data.password}
            onChange={handleOnChange}
            error={errors.password}
          />
          <CustomTextField
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            bottom={16}
            value={data.confirmPassword}
            onChange={handleOnChange}
            error={errors.confirmPassword}
          />

          <Box display='flex' alignItems='center' gap={6} mb={16}>
            <CheckCircle
              sx={{
                color:
                  data.password?.length >= 8
                    ? colors.successLight
                    : colors.border,
              }}
            />
            <Typography color='text.secondary'>
              Must be at least 8 characters
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' gap={6} mb={32}>
            <CheckCircle
              sx={{
                color: containsSpecialCharacter(data.password)
                  ? colors.successLight
                  : colors.border,
              }}
            />
            <Typography color='text.secondary'>
              Must Contain one special character
            </Typography>
          </Box>
        </>
      )}

      <CustomButton
        fullWidth
        disabled={loading}
        onClick={passwordSet ? handleBackToLogin : handleResetPassword}
      >
        {passwordSet ? "Continue" : "Reset Password"}
      </CustomButton>

      {passwordSet && (
        <CustomButton
          fullWidth
          variant='text'
          startIcon={<ArrowBack />}
          onClick={handleBackToLogin}
          sx={{ color: colors.text, mt: 24, py: 5 }}
        >
          Back to log in
        </CustomButton>
      )}
    </CustomDialog>
  );
};

export default SetPasswordDialog;
