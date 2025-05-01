import PageLayout from "../PageLayout/PageLayout";
import { Box, Typography } from "@mui/material";
import { navbarHeight } from "../../Utils/spacings";
import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();

  return (
    <PageLayout hideSidebar sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          maxWidth: "100vw",
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <Typography
          variant='h1'
          className='pop-out-animation'
          textAlign='center'
        >
          {t("Games coming soon...")}
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Games;
