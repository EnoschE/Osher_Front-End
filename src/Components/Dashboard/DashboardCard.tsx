import { Box, Typography, keyframes } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { useNavigate } from "react-router-dom";

const fadeUp = keyframes`
  0% {
    transform: translateY(35px);
		opacity: 0;
  }
  60% {
    transform: translateY(-4px);
		opacity: 1;
  }
  100% {
    transform: translateY(0);
		opacity: 1;
  }
`;

const DashboardCard = ({
  value,
  label,
  children,
  delay = 0,
  disableHoverEffect,
  path,
}: {
  value?: number;
  label?: string;
  path?: string;
  children?: React.ReactNode;
  delay?: number;
  disableHoverEffect?: boolean;
}) => {
  const colors = useSelector(selectColors);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: 24,
        borderRadius: borderRadius.lg,
        boxShadow: "0px 3px 13px 0px #0000000d",
        border: `0.5px solid ${colors.border}`,
        transition: "all ease-out 0.15s",
        animation: `0.4s ${fadeUp} ${delay}s ease both`,
        cursor: disableHoverEffect ? "auto" : "pointer",
        "&:hover": disableHoverEffect
          ? {}
          : {
              boxShadow: "0px 22px 47px 0px #0000000d",
            },
      }}
      onClick={path ? () => navigate(path) : undefined}
    >
      {children || (
        <>
          <Typography variant='h1' fontSize={68} lineHeight={"52px"}>
            {value || 0}
          </Typography>
          <Typography mt={20} color='text.secondary'>
            {label}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default DashboardCard;
