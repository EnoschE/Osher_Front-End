import { keyframes } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import colors from "../../Utils/colors";
import { navbarHeight } from "../../Utils/spacings";
import { isUserLoggedIn } from "../../Services/userService";
import { useTranslation } from "react-i18next";
import PageLayout from "../PageLayout/PageLayout";

const fadeUpAnimation = keyframes`
  0% {
    transform: translateY(40px);
    // transform: translateY(120%);
		opacity: 0;
  }
  75% {
    transform: translateY(-5px);
    // transform: translateY(-15%);
		opacity: 1;
  }
  100% {
    transform: translateY(0px);
    // transform: translateY(0%);
		opacity: 1;
  }
`;

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();

  const navigateToHome = () =>
    navigate(isLoggedIn ? allRoutes.DASHBOARD : allRoutes.HOME);

  return (
    <PageLayout hideSidebar sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: `calc(100vh - ${navbarHeight}px)`,
          "& h1": {
            fontSize: "100px",
            fontWeight: "700",
            WebkitTextStrokeWidth: { xs: 3, md: 4 },
            WebkitTextStrokeColor: colors.text,
            animation: `0.3s ${fadeUpAnimation} 0.01s ease-out both`,
          },
          "& h4": {
            marginBottom: 18,
            animation: `0.3s ${fadeUpAnimation} 0.06s ease-out both`,
          },
          "& button": {
            animation: `0.3s ${fadeUpAnimation} 0.11s ease-out both`,
          },
        }}
      >
        <Typography variant='h1'>404</Typography>
        <Typography variant='h4'>{t("Page not found!")}</Typography>
        <CustomButton onClick={navigateToHome}>
          {t(isLoggedIn ? `Back to Dashboard` : "Back to Home")}
        </CustomButton>
      </Box>
    </PageLayout>
  );
};

export default NotFound;
