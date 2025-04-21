import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import AnimatedHeading from "../Common/AnimatedHeading";
import { borderRadius } from "../../Utils/spacings";
import ArrowButton from "../Common/ArrowButton";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import {
  fetchDashboardData,
  selectDashboardData,
} from "../../Redux/Slices/dashboardSlice";

const DashboardCard = ({
  digit,
  text,
  onClick,
  animationDelay,
}: {
  digit: number;
  text: string;
  onClick: () => void;
  animationDelay?: number;
}) => {
  const formattedDigit = digit < 10 ? `0${digit}` : digit.toString();

  return (
    <Box
      className='animated-block'
      sx={{
        padding: "14px 24px",
        borderRadius: borderRadius.md,
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "white",
        transition: "all 0.2s ease-in-out",
        animationDelay: `${animationDelay}s`,

        "&:hover": {
          boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 46px 3px",
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <AnimatedHeading
        heading={formattedDigit}
        charactersBaseAnimation
        fontSize={150}
        animationDelay={animationDelay}
      />
      <Typography variant='h5' display='flex' alignItems='center' gap={8}>
        {text} <ArrowButton onClick={onClick} />
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const dashboardData = useSelector(selectDashboardData);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, []);

  const cards = [
    { digit: dashboardData.brands, text: "Brands", path: allRoutes.BRANDS },
    {
      digit: dashboardData.influencers,
      text: "Influencers",
      path: allRoutes.INFLUENCERS,
    },
    { digit: dashboardData.ads, text: "Ads", path: allRoutes.ADS },
  ];

  return (
    <PageLayout loading={dashboardData.loading} hideBackButton>
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

      {!dashboardData.loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(2, 1fr)", sm: "repeat(1, 1fr)" },
            gap: 20,
          }}
        >
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              digit={card.digit}
              text={card.text}
              onClick={() => navigate(card.path)}
              animationDelay={index * 0.2 + 0.2}
            />
          ))}
        </Box>
      )}
    </PageLayout>
  );
};

export default Dashboard;
