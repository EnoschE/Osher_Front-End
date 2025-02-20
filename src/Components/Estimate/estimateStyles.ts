import { Box, styled } from "@mui/material";
import { borderRadius, navbarHeight } from "../../Utils/spacings";

export const EstimateContainer = styled(Box)(({ theme }) => ({
	padding: 32,
	display: "grid",
	gridTemplateColumns: "394px 1fr",
	gap: 32,
	maxWidth: "100vw",

	"& .maps-block": {
		width: "100%",
		height: `calc(100vh - 32px - 32px - ${navbarHeight}px)`,
		borderRadius: borderRadius.lg,
		objectFit: "cover",
	},
	"& .left-image": {
		width: "100%",
		height: 174,
		borderRadius: borderRadius.lg,
		objectFit: "cover",
		objectPosition: "center center",
		marginY: 10,
	},

	[theme.breakpoints.down("md")]: {
		gridTemplateColumns: "1fr",
		"& .maps-block": {
			height: "auto",
			minHeight: 400,
		},
	},
}));
