import { Chart } from "react-chartjs-2";
import { Typography } from "@mui/material";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";

interface CustomDoughnutChartProps {
	value?: number;
	size?: number | string;
}

const CustomDoughnutChart = ({ value = 20, size = "100%" }: CustomDoughnutChartProps) => {
	const colors = useSelector(selectColors);
	return (
		<div
			style={{
				width: size,
				// height: size,
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Typography variant="h2" sx={{ position: "absolute", pt: 10 }}>
				{value}%
			</Typography>
			<Chart
				type="doughnut"
				data={{
					datasets: [
						{
							data: [value],
							backgroundColor: [colors.primary],
							borderWidth: 0,
						},
					],
				}}
				options={{
					responsive: true,
					cutout: "75%",
					maintainAspectRatio: true,
					plugins: {
						tooltip: {
							enabled: false,
						},
					},
				}}
				style={{ maxWidth: "100%" }}
			/>
		</div>
	);
};
export default CustomDoughnutChart;
