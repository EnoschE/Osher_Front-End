import { Box, SxProps, Typography, keyframes } from "@mui/material";
import colors from "../../Utils/colors";

const movingForward = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const CustomMarquee = ({
  text = "Customer",
  sx,
}: {
  text: string;
  sx?: SxProps;
}) => {
  return (
    <Box
      className='text-wrapper'
      sx={{
        ...sx,
        position: "absolute",
        zIndex: -1,
        display: "flex",
        justifyContent: "flex-start",
        overflow: "hidden",
        maxWidth: {
          xs: `calc(100% + ${24}px + ${24}px)`,
          sm: `calc(100% + ${60}px + ${60}px)`,
        },
        width: {
          xs: `calc(100% + ${24}px + ${24}px)`,
          sm: `calc(100% + ${60}px + ${60}px)`,
        },
        marginLeft: {
          xs: `-${24}px`,
          sm: `-${60}px`,
        },
        top: {
          xs: `-${24}px`,
          sm: `-${42}px`,
        },

        "& h2": {
          whiteSpace: "nowrap",
          paddingInline: "4rem",
          letterSpacing: "0px",
          margin: 0,
          animation: `${movingForward} ${
            text?.length ? text?.length * 4.5 : 25
          }s linear infinite`,
          // color: "white",
          // textShadow: `1px 1px 1px ${colors.primaryLight}, -1px 1px 1px ${colors.primaryLight}, -1px -1px 0 ${colors.primaryLight}, 1px -1px 0 ${colors.primaryLight}`,
          background: `linear-gradient(to bottom, ${
            colors.textMid + 65
          } -20%, white 75%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "180px", sm: "220px", md: "350px" },
          lineHeight: { xs: "220px", sm: "265px", md: "414px" },
          fontWeight: 600,
        },
      }}
    >
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
      <Typography component='h2'>{text}</Typography>
    </Box>
  );
};

export default CustomMarquee;
