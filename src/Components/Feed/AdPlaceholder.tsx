import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../Utils/spacings";

const AdPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        borderRadius: borderRadius.xl,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 450,
        boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
        bgcolor: "darkgrey",
        color: "white",
      }}
    >
      <span>{t("AD will be displayed here")}</span>
    </Box>
  );
};

export default AdPlaceholder;
