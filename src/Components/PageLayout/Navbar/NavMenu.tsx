import { Box } from "@mui/material";
import VolumeButtons from "./VolumeButtons";
import LanguageSelector from "./LanguageSelector";
import { DarkModeOutlined } from "@mui/icons-material";
import CustomButton from "../../Common/CustomButton";
import { useTranslation } from "react-i18next";

const NavMenu = ({ onNap }: { onNap: () => void }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 3, sm: 18 },
        "& button": {
          p: 2,
          minWidth: { xs: 42, sm: 46 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          fontSize: { sm: 12, xs: 10 },
          fontWeight: 500,
          color: "text.primary",
        },
        "& svg": {
          width: { xs: 24, sm: 28 },
          height: { xs: 24, sm: 28 },
        },
      }}
    >
      <LanguageSelector />
      <VolumeButtons />
      <CustomButton variant='text' onClick={onNap}>
        <DarkModeOutlined />
        {t("Nap")}
      </CustomButton>
    </Box>
  );
};

export default NavMenu;
