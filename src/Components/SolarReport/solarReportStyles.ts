import { Box, keyframes, styled } from "@mui/material";
import { borderRadius, navbarHeight, tabsHeight } from "../../Utils/spacings";

interface SolarReportComponentsProps {
	forDashboard?: boolean;
}

export const SolarReportContainer = styled(Box)<SolarReportComponentsProps>(({ theme, forDashboard }) => ({
	padding: 32,
	paddingInline: forDashboard ? 0 : 32,
	display: "grid",
	gridTemplateColumns: "394px 1fr",
	gap: 32,
	maxWidth: "100vw",
	alignItems: "flex-start",

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
	},
}));

export const SolarReportRightColumn = styled(Box)<SolarReportComponentsProps>(({ theme, forDashboard }) => ({
	width: "100%",
	// minHeight: forDashboard
	// 	? `calc(100vh - 32px - 32px - ${navbarHeight}px - ${tabsHeight}px)`
	// 	: `calc(100vh - 32px - 32px - ${navbarHeight}px)`,
	height: forDashboard
		? `calc(100vh - 32px - 32px - ${navbarHeight}px - ${tabsHeight}px)`
		: `calc(100vh - 32px - 32px - ${navbarHeight}px)`,
	borderRadius: borderRadius.sm,
	// backgroundColor: colors.primaryExtraLight,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	position: "sticky",
	top: forDashboard ? `${32 + 74 + navbarHeight}px` : `${32 + navbarHeight}px`,
	overflow: "hidden",

	"& .right-image": {
		width: "100%",
		objectFit: "cover",
		flexGrow: 1,
	},

	"& .fade-in-block": {
		animation: `0.3s ${fadeUp} 0s ease both`,
	},

	[theme.breakpoints.down("md")]: {
		gridTemplateColumns: "1fr",
		minHeight: "auto",
		height: "auto",

		justifyContent: "space-between",
		gap: 50,
		paddingBlock: 20,
	},
}));

export const WhiteBillBlock = styled(Box)(() => ({
	backgroundColor: "white",
	padding: "20px 18px",
	borderRadius: borderRadius.sm,
	// border: `1px solid ${colors.border}`,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 10,
}));

export const GrayBlock = styled(Box)(() => ({
	padding: 20,
	borderRadius: borderRadius.md,
	// backgroundColor: colors.lightGray,
}));

export const DashBorderedBox = styled(Box)(({ theme }) => ({
	// border: `1px solid ${colors.border}`,
	padding: "8px 16px",
	borderRadius: borderRadius.xs,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 40,

	[theme.breakpoints.down("sm")]: {
		flexDirection: "column",
		gap: 20,
	},
}));

// ==========|  Animations  |==========

const fadeUp = keyframes`
  0% {
    transform: translateY(70px);
		opacity: 0;
  }
  60% {
    transform: translateY(-5px);
		opacity: 1;
  }
  100% {
    transform: translateY(0);
		opacity: 1;
  }
`;
