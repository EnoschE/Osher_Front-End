import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import { GrayTextBlock, RoundedImage, TwoColumnGrid } from "./whyUsStyles";
import { HomeImage } from "../../Utils/Images";
import { useRef } from "react";

const ourReach = [
	{
		title: "Control",
		description: `Instead of having a variable bill that fluctuates all the time, have a steady and fixed predictable cost f energy all year long for 25 + years.`,
	},
	{
		title: "Environmental Impact",
		description: `We are like tenant farmers, chopping down the fence around our house for fuel, when we should be using nature’s inexhaustible sources of energy.`,
	},
	{
		title: "Savings & Stability",
		description: `When owning your source of power vs "renting" from the power company, you often stabilize yourself against rising energy costs save day.`,
	},
	{
		title: "Home Value",
		description: `Solar is classified as a home improvement; it is an energy producing asset on the home. There are a few calculations when determining value.`,
	},
];

const OurSolutions = ({ satelliteImage, streetViewImage }: { satelliteImage?: any; streetViewImage?: any }) => {
	const rightColumnRef = useRef<HTMLDivElement | null>(null);
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	const rightColumnHeight = rightColumnRef.current?.offsetHeight || 500;
	const bottomImageHeight = isSmallScreen ? "auto" : rightColumnHeight - 240 - 20;

	return (
		<TwoColumnGrid mt={48}>
			<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, order: -1 }}>
				<RoundedImage src={satelliteImage || HomeImage} alt="" style={{ height: 240 }} />
				<RoundedImage src={streetViewImage || HomeImage} style={{ height: bottomImageHeight, flexGrow: 1 }} alt="" />
			</Box>

			<Box ref={rightColumnRef}>
				<Typography variant={isSmallScreen ? "h3" : "h1"} fontWeight={500} mb={19}>
					You are on track for some exciting solar benefits
				</Typography>

				{ourReach.map((sol, idx) => (
					<GrayTextBlock mb={idx !== ourReach.length - 1 ? 16 : 0} key={sol.title}>
						<Typography variant="h5">{sol.title}</Typography>
						<Typography fontSize={16}>{sol.description} </Typography>
					</GrayTextBlock>
				))}
			</Box>
		</TwoColumnGrid>
	);
};

export default OurSolutions;
