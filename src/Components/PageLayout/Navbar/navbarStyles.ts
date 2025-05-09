import { AppBar, Box, styled } from "@mui/material";
import { navbarHeight } from "../../../Utils/spacings";
import colors from "../../../Utils/colors";

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  backdropFilter: "saturate(200%) blur(15px)",
  WebkitBackdropFilter: "saturate(200%) blur(15px)",

  boxShadow: "none",
  padding: "8px 61px",
  bottom: 0,
  top: "auto",
  zIndex: 10,
  height: navbarHeight,
  position: "fixed",
  borderTop: `1px solid ${colors.border}`,
  color: colors.text,

  [theme.breakpoints.down("md")]: {
    padding: "8px 18px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 10px",
  },
}));

export const StyledMenuBlock = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 24,
  color: "inherit",
  [theme.breakpoints.down("sm")]: {
    gap: 8,
  },
}));
