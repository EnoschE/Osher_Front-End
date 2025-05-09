import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Loader from "../Common/Loader";
import { Box, CssBaseline, SxProps, Toolbar } from "@mui/material";
import { navbarHeight, sidebarWidth } from "../../Utils/spacings";
import LayoutSidebar from "./Sidebar/LayoutSidebar";

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
    <Box
      position='relative'
      sx={{
        // TODO: make it 100vh with autoscroll
        height: "100svh",
        maxHeight: "100svh",

        display: "flex",
        backgroundColor: "#fff",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='1' y2='0' gradientTransform='rotate(0,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%23ff8324'/%3E%3Cstop offset='1' stop-color='%23ffb01f'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(0,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%23ff7930'/%3E%3Cstop offset='1' stop-color='%23FC0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23FFF' fill-opacity='0' stroke-miterlimit='10'%3E%3Cg stroke='url(%23a)' stroke-width='3.3'%3E%3Cpath d='M1409 581 1450.35 511 1490 581z'/%3E%3Ccircle stroke-width='1.1' transform='' cx='500' cy='100' r='40'/%3E%3Cpath transform='' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'/%3E%3C/g%3E%3Cg stroke='url(%23b)' stroke-width='1'%3E%3Cpath transform='' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'/%3E%3Crect stroke-width='2.2' transform='' x='1039' y='709' width='100' height='100'/%3E%3Cpath transform='' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
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
          minHeight: "100svh",
          overflow: "auto",
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
