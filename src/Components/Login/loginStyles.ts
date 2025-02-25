import { Box, keyframes, styled } from "@mui/material";
import { borderRadius, navbarHeight } from "../../Utils/spacings";
import colors from "../../Utils/colors";

export const LoginContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr",
  gap: 32,
  padding: 32,
  maxWidth: "100vw",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const LoginLeftBlock = styled(Box)(({ theme }) => ({
  padding: "38px 83px 0px 83px",
  width: "100%",
  minWidth: 540,
  minHeight: `calc(100vh - 32px - 32px - ${navbarHeight}px)`,
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.down("md")]: {
    padding: 0,
    minWidth: "auto",
  },
}));

export const LoginRightBlock = styled(Box)(({ theme }) => ({
  padding: 38,
  width: "100%",
  height: `calc(100vh - 32px - 32px - ${navbarHeight}px)`,
  position: "sticky",
  top: `${32 + navbarHeight}px`,

  "& .purple-box": {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.xl,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    objectFit: "cover",
    // backgroundColor: colors.primary + "10",
    // objectFit: "contain",
    // padding: 80,
    // filter: 'drop-shadow(5px 5px 30px rgba(0,0,0,0.15))'

    // backgroundImage: `radial-gradient(
    // 	circle 40vw at 95.6% 30%,
    // 	 rgb(53, 178, 255, 0.45) 0.2%,
    // 	#ffffff00 100.2%
    // 	), radial-gradient(
    // 	circle 45vw at 5.6% 70%,
    // 	rgb(255, 53, 184, 0.4) 0.2%,
    // 	#ffffff00 100.2%
    // 	)`,
  },

  [theme.breakpoints.down("md")]: {
    padding: 0,
    height: "auto",
    display: "none",
  },
}));

const useLoginStyles = () => {
  const IconSquareBox = styled(Box)(() => ({
    height: 53,
    width: 53,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginInline: "auto",
    marginTop: 10,
  }));

  return {
    IconSquareBox,
  };
};

export default useLoginStyles;

// ==========|  Animations  |==========

const fadeUp = keyframes`
  0% {
    transform: translateY(150px);
		opacity: 0;
  }
  60% {
    transform: translateY(-15px);
		opacity: 1;
  }
  100% {
    transform: translateY(0);
		opacity: 1;
  }
`;

const fadeUpRotateLeft = keyframes`
  0% {
    transform: rotate(0deg) translateX(0);
		opacity: 0;
  }
  60% {
    transform: rotate(-6deg) translateX(-16%);
		opacity: 1;
  }
  100% {
    transform: rotate(-5deg) translateX(-15%);
		opacity: 1;
  }
`;

const fadeUpRotateRight = keyframes`
  0% {
    transform: rotate(0deg) translateX(0);
		opacity: 0;
  }
  60% {
    transform: rotate(6deg) translateX(16%);
		opacity: 1;
  }
  100% {
    transform: rotate(5deg) translateX(15%);
		opacity: 1;
  }
`;
