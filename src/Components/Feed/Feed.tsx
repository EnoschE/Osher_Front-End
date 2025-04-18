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

const Feed = () => {
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
      <AnimatedHeading heading={`Welcome to the Feed of Osher TV`} />
    </PageLayout>
  );
};

export default Feed;
