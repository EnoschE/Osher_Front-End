import { AppBar, Box, styled } from "@mui/material";
import { navbarHeight } from "../../Utils/spacings";

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	// WebkitBackdropFilter: "saturate(180%) blur(15px)",
	// backdropFilter: "saturate(180%) blur(15px)",
	// backgroundColor: "rgba(255, 255, 255, 0.7)",
	backgroundColor: "white",
	boxShadow: "none",
	// color: colors.text,
	// borderBottom: `1px solid ${colors.border}`,
	padding: "8px 61px",
	// position: "sticky",
	top: 0,
	zIndex: 10,
	height: navbarHeight,

	[theme.breakpoints.down("sm")]: {
		padding: "8px 32px",
	},
}));

export const StyledMenuBlock = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: 24,
	color: "inherit",
	[theme.breakpoints.down("sm")]: {
		gap: 12,
	},
}));
