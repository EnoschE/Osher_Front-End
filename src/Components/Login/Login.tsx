import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import Navbar from "../Navbar/Navbar";
import { LoginContainer, LoginLeftBlock, LoginRightBlock } from "./loginStyles";
import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import CustomTextField from "../Common/CustomTextField";
import CustomCheckBox from "../Common/CustomCheckBox";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import { loginUser } from "../../Services/userService";
import Loader from "../Common/Loader";
import CustomButton from "../Common/CustomButton";
import { useDispatch } from "../../Redux/reduxHooks";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { getProfile } from "../../Services/profileService";
import { navbarHeight } from "../../Utils/spacings";
import { HomeImage } from "../../Utils/Images";

interface DataProps {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [data, setData] = useState<DataProps>({ email: "", password: "" });
  const [errors, setErrors] = useState<DataProps>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [forgotPasswordDialog, setForgotPasswordDialog] =
    useState<boolean>(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({ ...state, [name]: "" }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.password = data.password ? "" : "Password cannot be empty";
    updatedErrors.email = data.email
      ? !EmailValidator.validate(data.email)
        ? "Enter a valid email"
        : ""
      : "Email cannot be empty";

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).find(Boolean);
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateData()) return;

    setLoading(true);
    try {
      const user: any = await dispatch(loginUser(data));

      if (user.token === "An Email sent to your account please verify") {
        toast.warn(
          "An email has been sent to your account. Please check your inbox and verify your email address."
        );
      } else if (user) {
        await onLoginSuccess();
      } else {
        onLoginFailure();
      }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const onLoginSuccess = async () => {
    await dispatch(getProfile());
    toast.success("Successfully signed in!");
    navigate(allRoutes.DASHBOARD);
  };

  const onLoginFailure = () => {
    toast.error("Something went wrong!");
  };

  const openForgotPasswordDialog = () => setForgotPasswordDialog(true);
  const closeForgotPasswordDialog = () => setForgotPasswordDialog(false);

  return (
    <>
      <Loader open={loading} />
      <Navbar navbarForNonProtectedRoutes />
      <LoginContainer mt={navbarHeight}>
        <LoginLeftBlock>
          <Typography variant={isMobileView ? "h3" : "h2"}>
            Sign in to your account
          </Typography>
          <Typography mt={10} mb={47}>
            Sign in to your account
          </Typography>

          {/* <GoogleLoginButton onSuccess={onLoginSuccess} onFailure={onLoginFailure} />
					<FacebookLoginButton onSuccess={onLoginSuccess} onFailure={onLoginFailure} />

					<div className="fb-like" data-share="true" data-width="450" data-show-faces="true"></div>

					<Divider sx={{ my: 32 }}>
						<Typography px={16} color='text.secondary'>
							Or
						</Typography>
					</Divider> */}

          <form onSubmit={handleLoginSubmit}>
            <CustomTextField
              name='email'
              label='Email Address'
              bottom={24}
              value={data.email}
              error={errors.email}
              onChange={handleOnChange}
            />
            <CustomTextField
              type='password'
              name='password'
              label='Password'
              bottom={19}
              value={data.password}
              error={errors.password}
              onChange={handleOnChange}
            />
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              mb={30}
            >
              {/* <CustomCheckBox
                text='Remember me'
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              /> */}
              <Box />
              <Typography className='link' onClick={openForgotPasswordDialog}>
                Forgot your password?
              </Typography>
            </Box>
            <CustomButton type='submit' fullWidth sx={{ mb: 20 }}>
              Sign In
            </CustomButton>
          </form>

          {/* <Typography textAlign="center" mt="auto" pt={12}>
						Don’t have an account?{" "}
						<span className="link" onClick={() => navigate(allRoutes.SIGN_UP)}>
							Create an Account
						</span>
					</Typography> */}
        </LoginLeftBlock>

        <LoginRightBlock>
          <Box 
          component='img' src={HomeImage}
           className='purple-box' />
        </LoginRightBlock>
      </LoginContainer>

      <ForgotPasswordDialog
        open={forgotPasswordDialog}
        onClose={closeForgotPasswordDialog}
      />
    </>
  );
};

export default Login;
