import { Box, styled } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { store } from "../../Redux/store";

const state = store.getState();
const colors = selectColors(state);

export const WelcomeBlockHeader = styled(Box)(() => ({
	padding: "20px 32px",
	backgroundColor: colors.lightGray,
	borderRadius: borderRadius.md,
	position: "relative",
	display: "flex",
	alignItems: "center",
	overflow: "hidden",
}));

export const TwoColumnGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: 40,
	[theme.breakpoints.down("sm")]: {
		gridTemplateColumns: "1fr",
	},
}));

export const RoundedImage = styled("img")(() => ({
	width: "100%",
	height: "100%",
	objectFit: "cover",
	borderRadius: borderRadius.xl,
}));

export const GrayTextBlock = styled(Box)(() => ({
	padding: 20,
	display: "flex",
	flexDirection: "column",
	gap: 8,
	borderRadius: borderRadius.sm,
	backgroundColor: colors.border,
}));

export const BillUploaderBox = styled(Box)(() => ({
	padding: "12px 20px",
	border: `1px solid ${colors.border}`,
	borderRadius: borderRadius.xs,
	width: "100%",
	display: "flex",
	alignItems: "center",
	gap: 14,
	position: "relative",
	overflow: "hidden",
	transition: "all ease 0.15s",
	backgroundColor: "white",
	zIndex: 0,
}));

export const BillUploaderLoading = styled(Box)(() => ({
	position: "absolute",
	width: "0%",
	height: "100%",
	backgroundColor: colors.lightGray,
	left: 0,
	top: 0,
	zIndex: -1,
	transition: "all ease-out 0.4s",
}));

export const BorderedBox = styled(Box)(() => ({
	padding: 24,
	borderRadius: borderRadius.md,
	border: `1px solid ${colors.border}`,
}));

export const GrayBoxForDetails = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	gap: 10,
	padding: "24px 40px",
	borderRadius: borderRadius.sm,
	backgroundColor: colors.lightGray,
	minWidth: 237,
	[theme.breakpoints.down("sm")]: {
		width: "100%",
	},
}));
