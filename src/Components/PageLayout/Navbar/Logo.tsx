import { Box } from "@mui/material";
import { OsherLogo } from "../../../Utils/Images";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";

const Logo = ({
  isVisible = true,
  forSidebar,
  onClick,
}: {
  isVisible?: boolean;
  forSidebar?: boolean;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Box
      component='img'
      src={OsherLogo}
      alt='Osher Logo'
      sx={{
        cursor: "pointer",
        display: isVisible ? "inline-block" : { sm: "none" },
        height: forSidebar ? "60px" : { xs: "30px", sm: "55px" },
        width: forSidebar ? "100%" : "auto",
        objectFit: "contain",
      }}
      onClick={() => {
        // navigate(isLoggedIn ? allRoutes.DASHBOARD : allRoutes.HOME);
        navigate(allRoutes.HOME);
        if (onClick) onClick();
      }}
    />
  );
};

export default Logo;
