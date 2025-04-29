import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import AnimatedHeading from "../Common/AnimatedHeading";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import {
  fetchDashboardData,
  selectDashboardData,
} from "../../Redux/Slices/dashboardSlice";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
} from "../../Services/userService";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const dashboardData = useSelector(selectDashboardData);
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();
  const isSuperAdmin = isSuperAdminLoggedIn();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const cards = [
    ...(!isBrand && !isInfluencer
      ? [
          {
            digit: dashboardData.brands,
            text: "Brands",
            path: allRoutes.BRANDS,
          },
          {
            digit: dashboardData.influencers,
            text: "Influencers",
            path: allRoutes.INFLUENCERS,
          },
        ]
      : []),
    ...(isSuperAdmin || isBrand
      ? [
          {
            digit: dashboardData.ads,
            text: `${isBrand ? "My " : ""}Ads`,
            path: allRoutes.ADS,
          },
        ]
      : []),
    ...(isSuperAdmin || isInfluencer
      ? [
          {
            digit: dashboardData.posts,
            text: `${isInfluencer ? "My " : ""}Posts`,
            path: allRoutes.POSTS,
          },
        ]
      : []),
  ];

  return (
    <PageLayout hideBackButton>
      <AnimatedHeading
        heading={`Welcome back, ${user.name ? `${user.name}! 👋` : ""}`}
      />

      <Typography
        variant='body2'
        mb={32}
        className='animated-block'
        style={{ animationDelay: `${4 / 21}s` }}
      >
        Let's check your stats!
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(2, 1fr)", sm: "repeat(1, 1fr)" },
          gap: 20,
        }}
      >
        {dashboardData.loading
          ? [...Array(2)].map((_, index) => (
              <DashboardCard
                key={index}
                isLoading
                digit={0}
                text=''
                animationDelay={index * 0.2 + 0.2}
                onClick={() => undefined}
              />
            ))
          : cards.map((card, index) => (
              <DashboardCard
                key={index}
                digit={card.digit}
                text={card.text}
                onClick={() => navigate(card.path)}
                animationDelay={index * 0.2 + 0.2}
              />
            ))}
      </Box>
    </PageLayout>
  );
};

export default Dashboard;
