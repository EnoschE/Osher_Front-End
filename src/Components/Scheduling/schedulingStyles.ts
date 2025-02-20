import { Box, styled } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";

export const BigIconCircle = styled(Box)(() => ({
	width: 93,
	height: 93,
	borderRadius: 47,
	// backgroundColor: colors.primary,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: "white",
	fontSize: 40,
}));

export const SiteSurveyLeftBlock = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	gap: 20,
	// backgroundColor: colors.lightGray,
	borderRadius: borderRadius.md,
	padding: 24,
	paddingTop: 41,
}));
