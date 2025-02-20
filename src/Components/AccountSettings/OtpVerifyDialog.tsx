import { Typography, styled } from "@mui/material";
import CustomDialog from "../Common/CustomDialog";
import { VerifiedUserOutlined } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLoginStyles from "../Login/loginStyles";
import OtpInput from "react-otp-input";
import { borderRadius } from "../../Utils/spacings";
import { verifyEmailOtp } from "../../Services/profileService";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { saveEmail, selectUser } from "../../Redux/Slices/userSlice";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface OtpVerifyDialogProps {
  open: boolean;
  onClose?: () => void;
  email?: string;
}

const OtpVerifyDialog = ({
  open,
  onClose,
  email = "",
}: OtpVerifyDialogProps) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setOtp("");
      setError("");
    }
  }, [open]);

  const handleOnChange = (value: string) => {
    setOtp(value);
    setError("");
  };

  const validateData = (currentValue = "") => {
    const updatedError = currentValue
      ? currentValue?.length === 4
        ? ""
        : "Please enter complete otp code"
      : "Otp cannot be empty";

    setError(updatedError);
    return !!updatedError;
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateData(otp)) return;

    setLoading(true);
    try {
      const data = {
        userId: user.id,
        otp,
        email,
      };
      const { data: res }: any = await verifyEmailOtp(data);

      if (res.message === "Email has been verified") {
        toast.success("Your email has been verified!");
        dispatch(saveEmail(email));
        onClose?.();
      } else {
        setError("Please enter the correct OTP code");
      }
    } catch (error: any) {
      if (error === "Invalid code passed. Check your inbox") {
        setError("Please enter the correct OTP code");
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const StyledInput = styled("input")(() => ({
    aspectRatio: "1/1",
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    fontSize: 28,
    fontWeight: 500,
    "&:focus, &:hover, &:active": {
      borderColor: colors.primary,
      borderWidth: 1,
      outline: "none !important",
    },
  }));

  // TODO in future: add loader in CustomButton, that will be displayed when we pass loading=true in CustomButton

  return (
    <CustomDialog open={open} onClose={onClose}>
      <IconSquareBox>
        <VerifiedUserOutlined />
      </IconSquareBox>

      <Typography variant='h2' my={16} textAlign='center'>
        Verify Your Email
      </Typography>
      <Typography
        fontSize={16}
        textAlign='center'
        mb={32}
        color='text.secondary'
      >
        Please check your inbox for a verification code to update your email
      </Typography>

      <form onSubmit={handleVerifyOtp}>
        <OtpInput
          shouldAutoFocus
          value={otp}
          numInputs={4}
          inputType='tel'
          onChange={handleOnChange}
          renderInput={(props) => <StyledInput {...props} />}
          containerStyle={{
            marginInline: "auto",
            width: "100%",
            gap: 16,
            justifyContent: "space-between",
          }}
          inputStyle={{
            width: "22%",
            ...(error ? { borderColor: colors.error } : {}),
          }}
        />
        {error && (
          <Typography mt={10} color='error' textAlign='center'>
            {error}
          </Typography>
        )}

        <CustomButton
          type='submit'
          fullWidth
          disabled={loading}
          sx={{ mt: 24, mb: 10 }}
        >
          Verify
        </CustomButton>
      </form>
    </CustomDialog>
  );
};

export default OtpVerifyDialog;
