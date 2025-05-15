import { Box } from "@mui/material";
import VolumeButtons from "./VolumeButtons";
import LanguageSelector from "./LanguageSelector";
import { DarkModeOutlined, ArrowBackOutlined } from "@mui/icons-material";
import CustomButton from "../../Common/CustomButton";
import { useTranslation } from "react-i18next";
import { useNavigate, useNavigationType } from "react-router-dom";
import BrightnessButtons from "./BrightnessButtons";
import { allRoutes } from "../../../Routes/AllRoutes";

const NavMenu = ({
  backButtonPath,
  hideBackButton,
  onNap,
}: {
  backButtonPath?: string;
  hideBackButton?: boolean;
  onNap: () => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else if (navigationType === "POP") {
      // No meaningful history (i.e., direct visit or refresh)
      navigate("/");
    } else {
      // Go back in app navigation history
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 3, sm: 18 },
        width: { xs: "120px !important", sm: "auto !important" },
        flexWrap: { xs: "wrap", sm: "auto" },
        justifyContent: "flex-end",

        "& button": {
          p: 2,
          minWidth: { xs: 35, sm: 46 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 0, sm: 4 },
          fontSize: { sm: 10, xs: 0 },
          fontWeight: 500,
          color: "text.primary",
        },
        "& svg": {
          width: { xs: 20, sm: 28 },
          height: { xs: 20, sm: 28 },
        },
      }}
    >
      {!hideBackButton && (
        <CustomButton variant='text' onClick={handleBack}>
          <ArrowBackOutlined />
          {t("Back")}
        </CustomButton>
      )}
      <LanguageSelector />
      <BrightnessButtons />
      <VolumeButtons />
      <CustomButton variant='text' onClick={onNap}>
        <DarkModeOutlined />
        {t("Nap")}
      </CustomButton>
    </Box>
  );
};

export default NavMenu;
