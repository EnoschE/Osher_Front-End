import { borderRadius } from "../../../Utils/spacings";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";

import { Chart } from "react-chartjs-2";
import { formatNumber } from "../../../Utils/utils";

interface DataProps {
	value: number | string;
	label: number | string;
}

interface CustomBarChartProps {
	data?: Array<DataProps>;
}

const CustomBarChart = ({ data = [] }: CustomBarChartProps) => {
	const colors = useSelector(selectColors);
	const labels = data.map((item) => item.label);
	const dataSet = data.map((item) => item.value);

	const maxIndex = data.reduce((maxIndex, current, index, array) => {
		return current.value > array[maxIndex].value ? index : maxIndex;
	}, 0);

	return (
		<Chart
			type="bar"
			style={{
				width: "100%",
				maxWidth: "100%",
			}}
			options={{
				aspectRatio: 2.77,
				plugins: {
					legend: { display: false },
					title: { display: false },
					tooltip: {
						titleFont: { size: 18 },
						bodyFont: { size: 14 },
						callbacks: {
							title: (val) => val[0].label,
							label: (val: any) => " $" + formatNumber(val.raw),
						},
					},
				},

				scales: {
					x: {
						border: { display: false },
						grid: { display: false },
						ticks: {
							font: { size: 14, weight: "500" },
							color: (val): string => (val.index === maxIndex ? colors.primary : "#81839F"),
						},
					},
					y: {
						border: { display: false },
						grid: { display: false },
						ticks: {
							callback: (value: any) => "$" + formatNumber(value),
							font: { size: 15, weight: "500" },
						},
					},
				},
			}}
			data={{
				labels,
				datasets: [
					{
						label: "",
						data: dataSet,
						backgroundColor: (context) => (context.dataIndex === maxIndex ? colors.primary : colors.border),
						hoverBackgroundColor: colors.primary,
						barPercentage: 0.7,
						borderSkipped: false,
						borderRadius: borderRadius.sm,
					},
				],
			}}
		/>
	);
};

export default CustomBarChart;
