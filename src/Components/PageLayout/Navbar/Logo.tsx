import { Box } from "@mui/material";
import { OsherLogo } from "../../../Utils/Images";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";

const Logo = ({ isVisible }: { isVisible: boolean }) => {
  const navigate = useNavigate();

  return (
    <Box
      component='img'
      src={OsherLogo}
      alt='Osher Logo'
      sx={{
        cursor: "pointer",
        display: isVisible ? "inline-block" : { sm: "none" },
        height: { xs: "40px", sm: "55px" },
      }}
      onClick={() => navigate(allRoutes.HOME)}
    />
  );
};

export default Logo;
