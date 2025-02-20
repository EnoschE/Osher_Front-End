import { Box, keyframes, styled } from "@mui/material";
import { borderRadius, navbarHeight, tabsHeight } from "../../Utils/spacings";

export const StatusUpdatingBox = styled(Box)(({ theme }) => ({
	// backgroundColor: colors.lightGray,
	borderRadius: borderRadius.sm,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: 16,
	padding: "80px 32px",
	minHeight: `calc(100vh - ${navbarHeight}px - ${tabsHeight}px - 60px - 60px - 38.8px - 18px)`,
	animation: `0.45s ${fadeUp} ease-out both`,

	[theme.breakpoints.down("xs")]: {
		padding: "40px 24px",
		minHeight: `calc(100vh - ${navbarHeight}px - ${tabsHeight}px - 32px - 32px)`,
	},
}));

const fadeUp = keyframes`
	0% {
		transform: scale(0.95);
	  opacity: 0;
  }
  60% {
    transform: scale(1.002);
		opacity: 1;
  }
  100% {
    transform: scale(1);
		opacity: 1;
  }
`;
