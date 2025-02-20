import { useState } from "react";
import { Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";

// import DashboardData from "./DashboardData";

const Dashboard = () => {
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <PageLayout loading={loading} hideBackButton>
      <Typography variant='h1' mb={8}>
        Welcome back, {user.name ? `${user.name}! 👋` : ""}
      </Typography>
      <Typography color='text.secondary' mb={32}>
        Let's check your stats!
      </Typography>

      {/* <DashboardData
        loading={loading}
        setLoading={setLoading}
        funnelName='All Customers Funnel'
      /> */}
    </PageLayout>
  );
};

export default Dashboard;
