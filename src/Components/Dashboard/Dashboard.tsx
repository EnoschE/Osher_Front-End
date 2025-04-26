declare global {
  interface Window {
    EpomAdVideoPlayer: any;
  }
}

import { useEffect, useRef } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
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
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
} from "../../Services/userService";

const DashboardCard = ({
  digit,
  text,
  onClick,
  animationDelay,
  isLoading,
}: {
  digit: number;
  text: string;
  onClick: () => void;
  animationDelay?: number;
  isLoading?: boolean;
}) => {
  const formattedDigit = digit < 10 ? `0${digit}` : digit.toString();

  return isLoading ? (
    <Skeleton
      variant='rectangular'
      width='100%'
      height={251}
      sx={{ borderRadius: borderRadius.md }}
    />
  ) : (
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
        fontSize={140}
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
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();
  const isSuperAdmin = isSuperAdminLoggedIn();
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };

    const loadCSS = (href: string) => {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    };

    const initPlayer = () => {
      if (window.EpomAdVideoPlayer) {
        new window.EpomAdVideoPlayer({
          adTagUrl:
            "https://serve.epomadserver.com/zQ44YJC2qrWqXq21uvTJIhNhDVazX15TtuL1aANzsrJu4lawq1b1_1S7zGidfl_B0U35xuBBCDKZiO39GfjIjeRGk2skRwUw",
          mainVideo: "https://cdn.epomadserver.com/video/sample.mp4",
          mainVideoPoster: "https://cdn.epomadserver.com/video/poster.webp",
          width: 480,
          height: 320,
        });
      }
    };

    loadCSS("https://cdn.epomadserver.com/evap/0.1/evap.css");
    loadScript("https://cdn.epomadserver.com/evap/0.1/evap.js")
      .then(() => initPlayer())
      .catch((err) => console.error("Failed to load Epom player", err));
  }, []);

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

      {/* Epom Ad Container */}
      <Box ref={adContainerRef} sx={{ mt: 4 }} />
    </PageLayout>
  );
};

export default Dashboard;
