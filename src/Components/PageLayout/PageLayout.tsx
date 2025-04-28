import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Loader from "../Common/Loader";
import { Box, CssBaseline, SxProps, Toolbar } from "@mui/material";
import { navbarHeight, sidebarWidth } from "../../Utils/spacings";
import LayoutSidebar from "./LayoutSidebar";

const PageLayout = ({
  children,
  loading,
  hideBackButton,
  backButtonPath,
  hideLayout,
  hideSidebar,
  sx,
}: {
  children?: ReactNode;
  loading?: boolean;
  hideBackButton?: boolean;
  backButtonPath?: string;
  hideLayout?: boolean;
  hideSidebar?: boolean;
  sx?: SxProps;
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
        navbarForNonProtectedRoutes={hideSidebar}
      />

      {!hideSidebar && (
        <LayoutSidebar
          open={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: hideSidebar
            ? "100%"
            : { sm: `calc(100% - ${sidebarWidth}px)` },
          p: { xs: 32, sm: "42px 60px" },
          ...sx,
        }}
      >
        {children}
        <Toolbar
          sx={{
            minHeight: `${navbarHeight}px !important`,
            height: navbarHeight,
          }}
        />
      </Box>
    </Box>
  ) : (
    <>{children}</>
  );
};

export default PageLayout;
