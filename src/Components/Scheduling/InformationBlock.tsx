import { ReactNode } from "react";
import { BigIconCircle } from "./schedulingStyles";
import { navbarHeight, tabsHeight } from "../../Utils/spacings";
import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import { DoneOutlineRounded } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface InformationBlockProps {
	title?: string | ReactNode;
	subtitle?: string | ReactNode;
	buttonText?: string;
	buttonOnClick?: () => void;
	height?: string | number;
}

const InformationBlock = ({ title, subtitle, buttonText, buttonOnClick, height }: InformationBlockProps) => {
	const colors = useSelector(selectColors);
	const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				minHeight: height || `calc(100vh - ${navbarHeight}px - ${tabsHeight}px)`,
				textAlign: "center",
			}}
		>
			<BigIconCircle sx={{ backgroundColor: colors.primary }}>
				<DoneOutlineRounded fontSize="inherit" />
			</BigIconCircle>
			<Typography variant={isMobileView ? "h3" : "h2"} mt={24}>
				{title}
			</Typography>
			<Typography fontSize={18} mt={24} mb={32} maxWidth={390}>
				{subtitle}
			</Typography>
			<CustomButton sx={{ minWidth: 300 }} onClick={buttonOnClick}>
				{buttonText}
			</CustomButton>
		</Box>
	);
};

export default InformationBlock;
