import { Box, Divider, Typography } from "@mui/material";
import { RoundedImage } from "./whyUsStyles";
import DayNightSolar from "./DayNightSolar";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { HomeImage } from "../../Utils/Images";
import { formatNumber } from "../../Utils/utils";
import { useEffect, useState } from "react";

const ValueWithTitle = ({ title = "", value = "" }: { title?: string; value?: string }) => {
	return (
		<Box>
			<Typography variant="h5" fontSize={18}>
				{title}
			</Typography>
			<Typography fontSize={16} mt={12}>
				{value}
			</Typography>
		</Box>
	);
};

const YourSolar = ({ id, data, streetViewImage }: { id?: string; data?: any; streetViewImage?: any }) => {
	const colors = useSelector(selectColors);

	const [solarData, setSolarData] = useState(data);

	useEffect(() => {
		setSolarData(data);
	}, [data]);

	const options = [
		{ title: "System Size", value: `${solarData?.SolarSize?.toLocaleString() || 0} kW` },
		{ title: "System Production", value: `${formatNumber(solarData?.OptimalSP || 0)} Khw` },
		{ title: "% electricity from Solar", value: "100 %" },
		{ title: "Panels", value: `${solarData?.Panels || 0} Hanwah Q-Cells 400` },
		{ title: "Inverter", value: `${solarData?.Panels || 0} Enphase micro inverters` },
		{
			title: "Warranties",
			value: "25 year equipment maintenance and monitoring 10 year workmanship warranty (includes roof penetration)",
		},
	];

	return (
		<Box id={id}>
			<Typography variant="h2" mt={60} mb={10}>
				Switch to solar and save big
			</Typography>
			<Typography fontSize={16} mb={32}>
				There is <b>no delivery charge</b> for electricity produced on your roof in MA. Switch to solar and save big.
			</Typography>
			<Box
				sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "0.4fr 0.6fr" }, gap: 26, alignItems: "stretch" }}
			>
				<Box
					sx={{
						borderRadius: borderRadius.sm,
						backgroundColor: colors.lightGray,
						display: "flex",
						flexDirection: "column",
						gap: 24,
						padding: 24,
						pb: 42,
					}}
				>
					<Typography variant="h4">Your Solar Panel System Specs </Typography>
					<Divider />
					{options.map((item, idx) => (
						<ValueWithTitle key={idx} title={item.title} value={item.value} />
					))}
				</Box>
				<RoundedImage alt="" src={streetViewImage || HomeImage} style={{ borderRadius: borderRadius.sm }} />
			</Box>

			<DayNightSolar />
		</Box>
	);
};

export default YourSolar;
