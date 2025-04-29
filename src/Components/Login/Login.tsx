import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { LoginContainer, LoginInnerBlock } from "./loginStyles";
import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import CustomTextField from "../Common/CustomTextField";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import { loginUser } from "../../Services/userService";
import CustomButton from "../Common/CustomButton";
import { useDispatch } from "../../Redux/reduxHooks";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { getProfile } from "../../Services/profileService";
import AnimatedHeading from "../Common/AnimatedHeading";
import PageLayout from "../PageLayout/PageLayout";
import { useTranslation } from "react-i18next";

interface DataProps {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [data, setData] = useState<DataProps>({ email: "", password: "" });
  const [errors, setErrors] = useState<DataProps>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
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
    toast.success(t("Successfully signed in!"));
    navigate(allRoutes.DASHBOARD);
  };

  const onLoginFailure = () => {
    toast.error(t("Something went wrong!"));
  };

  // const openForgotPasswordDialog = () => setForgotPasswordDialog(true);
  const closeForgotPasswordDialog = () => setForgotPasswordDialog(false);

  return (
    <PageLayout loading={loading} hideSidebar hideBackButton sx={{ p: 0 }}>
      <LoginContainer>
        <LoginInnerBlock>
          <AnimatedHeading
            heading={t("Sign in")}
            variant={isMobileView ? "h3" : "h2"}
            animationSpeed='fast'
          />
          <Typography
            className='animated-block'
            sx={{ animationDelay: `${1 / 21}s`, mt: 10, mb: 40 }}
          >
            {t("Sign in to your Osher account")}
          </Typography>

          <form onSubmit={handleLoginSubmit}>
            <CustomTextField
              name='email'
              label={"Email Address"}
              placeholder={"Enter your email"}
              bottom={24}
              value={data.email}
              error={errors.email}
              onChange={handleOnChange}
              className='animated-block'
              style={{ animationDelay: `${2 / 21}s` }}
            />
            <CustomTextField
              className='animated-block'
              style={{ animationDelay: `${3 / 21}s` }}
              type='password'
              name='password'
              label={"Password"}
              placeholder={"Enter your password"}
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
              className='animated-block'
              sx={{ animationDelay: `${4 / 21}s` }}
            >
              <Box />
              {/* <Typography className="link" onClick={openForgotPasswordDialog}>
                {t("Forgot your password?")}
              </Typography> */}
            </Box>
            <CustomButton
              type='submit'
              fullWidth
              className='animated-block'
              sx={{ animationDelay: `${5 / 21}s`, mb: 20 }}
            >
              {t("Sign in")}
            </CustomButton>
          </form>

          {/* <Typography textAlign="center" mt="auto" pt={12}>
						Don’t have an account?{" "}
						<span className="link" onClick={() => navigate(allRoutes.SIGN_UP)}>
							Create an Account
						</span>
					</Typography> */}
        </LoginInnerBlock>
      </LoginContainer>

      <ForgotPasswordDialog
        open={forgotPasswordDialog}
        onClose={closeForgotPasswordDialog}
      />
    </PageLayout>
  );
};

export default Login;
