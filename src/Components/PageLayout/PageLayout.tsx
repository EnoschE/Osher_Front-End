import { ReactNode, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Loader from "../Common/Loader";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { sidebarWidth } from "../../Utils/spacings";
import LayoutSidebar from "./LayoutSidebar";

const PageLayout = ({
  children,
  loading,
  hideBackButton,
  backButtonPath,
  hideLayout,
}: {
  children?: ReactNode;
  loading?: boolean;
  hideBackButton?: boolean;
  backButtonPath?: string;
  hideLayout?: boolean;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top when a new page opens
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return !hideLayout ? (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Loader open={loading} />
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        backButtonPath={backButtonPath}
        hideBackButton={hideBackButton}
      />
      <LayoutSidebar
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          p: { xs: 32, sm: "42px 60px" },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  ) : (
    <>{children}</>
  );
};

export default PageLayout;
