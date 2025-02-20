import { Box, Drawer, List, ListItem, styled } from "@mui/material";
import { borderRadius, sidebarWidth } from "../../Utils/spacings";

export const StyledDrawerBox = styled(Box)(() => ({
	minHeight: "100%",
	height: "max-content",
	paddingTop: "10px",
	overflowY: "auto",
	WebkitBackdropFilter: "saturate(180%) blur(20px)",
	backdropFilter: "saturate(180%) blur(20px)",
	backgroundColor: "rgba(255, 255, 255, 0.7)",
	"&::-webkit-scrollbar": { display: "none" },
}));

export const StyledDrawerList = styled(List)(() => ({
	marginTop: "10px",
	padding: "12px",
	"& .MuiListItemIcon-root": {
		minWidth: "unset",
		marginRight: "14px",
		svg: {
			width: "18px",
			height: "18px",
		},
	},
}));

export const StyledDrawerListItem = styled(ListItem)(() => ({
	borderRadius: borderRadius.sm,
	// backgroundColor: isActive ? colors.primary : "transparent",
	// color: isActive ? "white" : colors.text,
	// svg: { path: { fill: isActive ? "white" : colors.text } },
	"& .MuiListItemButton-root": {
		borderRadius: borderRadius.sm,
	},
}));

export const StyledDrawerListSubItem = styled(ListItem)(() => ({
	borderRadius: borderRadius.sm,
	// backgroundColor: isActive ? colors.primary : "transparent",
	// color: isActive ? "white" : colors.text,
	// svg: { path: { fill: isActive ? "white" : colors.text } },
	marginLeft: 16,
	width: "calc(100% - 16px)",

	"& .MuiListItemButton-root": {
		borderRadius: borderRadius.sm,
	},
}));

export const StyledDrawer = styled(Drawer)(() => ({
	"& .MuiDrawer-paper": {
		backgroundColor: "transparent",
		width: sidebarWidth,
		boxShadow: "none",
	},
}));
