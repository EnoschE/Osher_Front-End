import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { useTranslation } from "react-i18next";
import { HomeContainer, HomeInnerBlock } from "./homeStyles";
import { borderRadius } from "../../Utils/spacings";
import colors from "../../Utils/colors";

const HomeCard = ({
  animationDelay,
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
  animationDelay?: number;
}) => {
  return (
    <Box
      onClick={onClick}
      className='pop-out-animation'
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: { xs: 200, sm: 350 },
        boxShadow: `5px 5px 15px 0 ${colors.primary}70`,
        cursor: "pointer",
        width: "100%",
        minWidth: "100%",
        padding: 35,
        borderRadius: borderRadius.xl,
        transition: "all ease 0.2s",
        animationDelay: `${animationDelay}s`,
        bgcolor: "primary.main",

        "&:hover": {
          boxShadow: `5px 30px 30px 0 ${colors.primary}80`,
        },
      }}
    >
      <Typography
        className='pop-out-animation'
        variant='h2'
        fontWeight={900}
        textAlign='center'
        fontSize={{ sm: 40, xs: 30 }}
        lineHeight={1}
        color='white'
        sx={{
          animationDelay: `${animationDelay}s`,
          textShadow: `1px 1px 1px #000, -1px 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000`,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToGames = () => navigate(allRoutes.GAMES);
  const goToExploreSpots = () => navigate(allRoutes.EXPLORE_SPOTS);
  const goToFeed = () => navigate(allRoutes.FEED);

  return (
    <PageLayout hideSidebar hideBackButton sx={{ p: 0 }}>
      <HomeContainer>
        <HomeInnerBlock>
          <HomeCard onClick={goToGames} text={t("PLAY GAMES AND WIN PRIZES")} />
          <HomeCard
            onClick={goToExploreSpots}
            text={t("SEE THE BEST SPOTS AROUND YOU")}
            animationDelay={0.05}
          />
          <HomeCard onClick={goToFeed} text={t("FEED")} animationDelay={0.1} />
        </HomeInnerBlock>
      </HomeContainer>
    </PageLayout>
  );
};

export default Home;
