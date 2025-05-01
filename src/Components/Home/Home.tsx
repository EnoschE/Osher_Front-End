import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { useTranslation } from "react-i18next";
import { HomeContainer, HomeInnerBlock } from "./homeStyles";
import HomeCard from "./HomeCard";

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
