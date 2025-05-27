import { Box, styled } from "@mui/material";
import { navbarHeight } from "../../Utils/spacings";
import { backgroundImage } from "../../Utils/colors";

export const HomeContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
  maxWidth: "100vw",
  minHeight: `calc(100vh - ${navbarHeight}px)`,
  ...backgroundImage,
}));

export const HomeInnerBlock = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  maxWidth: 1050,
  width: "100%",
  gap: 40,

  [theme.breakpoints.down("md")]: {
    gap: 20,
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));
