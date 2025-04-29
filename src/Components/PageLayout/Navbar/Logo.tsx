import { Box } from "@mui/material";
import { OsherLogo } from "../../../Utils/Images";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import { isUserLoggedIn } from "../../../Services/userService";

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
  const isLoggedIn = isUserLoggedIn();

  return (
    <Box
      component='img'
      src={OsherLogo}
      alt='Osher Logo'
      sx={{
        cursor: "pointer",
        display: isVisible ? "inline-block" : { sm: "none" },
        height: forSidebar ? "60px" : { xs: "40px", sm: "55px" },
        width: forSidebar ? "100%" : "auto",
        objectFit: "contain",
      }}
      onClick={() => {
        navigate(isLoggedIn ? allRoutes.DASHBOARD : allRoutes.HOME);
        if (onClick) onClick();
      }}
    />
  );
};

export default Logo;
