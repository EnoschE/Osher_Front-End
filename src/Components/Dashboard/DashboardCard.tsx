import { Box, Skeleton, Typography } from "@mui/material";
import AnimatedHeading from "../Common/AnimatedHeading";
import { borderRadius } from "../../Utils/spacings";
import ArrowButton from "../Common/ArrowButton";

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
        transition: "all 0.3s ease",
        animationDelay: `${animationDelay}s`,

        "&:hover": {
          boxShadow: "rgba(17, 17, 26, 0.11) 0px 0px 56px 10px",
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

export default DashboardCard;
