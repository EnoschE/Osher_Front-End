import { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import SchedulingTabs from "./SchedulingTabs";
import { Box, SxProps, Theme, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";

const SchedulingPageLayout = ({ children, sx }: { children?: ReactNode; sx?: SxProps }) => {
	const { pathname } = useLocation();
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	return (
		<>
			<Navbar />
			<SchedulingTabs value={pathname} />
			<Box px={isSmallScreen ? 32 : 80} sx={sx}>
				{children}
			</Box>
		</>
	);
};

export default SchedulingPageLayout;
