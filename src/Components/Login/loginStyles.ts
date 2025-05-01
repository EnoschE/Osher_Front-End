import { Box, styled } from "@mui/material";
import { borderRadius, navbarHeight } from "../../Utils/spacings";
import colors from "../../Utils/colors";

export const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
  maxWidth: "100vw",
  height: `calc(100vh - ${navbarHeight}px)`,

  // backgroundImage: `radial-gradient(
  //   circle 35vw at 105% 45%,
  //  ${colors.primary}40 0.2%,
  //  #ffffff00 100.2%
  //  ), radial-gradient(
  //   circle 40vw at 10.6% 25%,
  //   ${colors.primary}40 0.2%,
  //   #fff 100.2%
  //   )`,

  // backgroundImage: `radial-gradient(
  //   circle 35vw at 105% 55%,
  //  ${colors.primary}40 0.2%,
  //  #ffffff00 100.2%
  //  ), radial-gradient(
  //   circle 40vw at 10.6% 105%,
  //   ${colors.primary}40 0.2%,
  //   #fff 100.2%
  //   )`,

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const LoginInnerBlock = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: 390,
  width: "100%",

  [theme.breakpoints.down("md")]: {
    padding: 0,
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
