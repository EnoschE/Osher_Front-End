import { Box, Typography } from "@mui/material";
import { BorderedBox } from "./whyUsStyles";
import CustomToggleButton from "../Common/CustomToggleButton";
import { useState } from "react";
import { SolarPowerDayImage, SolarPowerNightImage } from "../../Utils/Images";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

const timeOptions = {
	DAY: { text: "Day", value: 1 },
	NIGHT: { text: "Night", value: 2 },
};

const DayNightSolar = () => {
	const colors = useSelector(selectColors);

	const [option, setOption] = useState<number | string>(timeOptions.DAY.value);
	const [applyTransitions, setApplyTransitions] = useState<boolean>(false);

	const handleChangeTab = (val: number | string) => {
		setOption(val);
		setApplyTransitions(true);
		setTimeout(() => setApplyTransitions(false), 200);
	};

	const isDarkMode = option === timeOptions.NIGHT.value;

	return (
		<>
			<Typography variant="h2" mt={56} mb={10}>
				Get Full Credit for Excess Energy Production
			</Typography>
			<Typography fontSize={16} mb={32}>
				While your system production is guaranteed, any excess electricity produced is yours to keep at no additional
				charge
			</Typography>
			<BorderedBox bgcolor={isDarkMode ? colors.darkBg : "transparent"}>
				<Box display="flex" justifyContent="center">
					<CustomToggleButton
						isDarkMode={isDarkMode}
						value={option}
						onChange={handleChangeTab}
						options={Object.values(timeOptions)}
					/>
				</Box>
				<Typography
					variant="body2"
					mb={11}
					mt={33}
					maxWidth={{ xs: "100%", sm: 400 }}
					color={isDarkMode ? "#ffff" : "auto"}
					minHeight={60}
					style={{
						transition: "all ease 0.15s",
						opacity: applyTransitions ? 0.25 : 1,
					}}
				>
					{isDarkMode
						? "When solar production is low such as night or winter you can draw back your electricity credits for free."
						: "Excess energy produced by your solar panels e.g. on a very sunny day is banked on the grid for free and stored as electricity credits"}
				</Typography>

				<img
					alt="Solar"
					src={isDarkMode ? SolarPowerNightImage : SolarPowerDayImage}
					width={"100%"}
					style={{
						transition: "all ease-out 0.15s",
						opacity: applyTransitions ? 0.2 : 1,
						transform: applyTransitions ? "scale(0.95)" : "scale(1)",
					}}
				/>
			</BorderedBox>
		</>
	);
};

export default DayNightSolar;
