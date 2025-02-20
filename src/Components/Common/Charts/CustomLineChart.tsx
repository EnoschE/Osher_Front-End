import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";
import { Chart } from "react-chartjs-2";
import { formatNumber } from "../../../Utils/utils";

interface DataProps {
	value: number | string;
	label: number | string;
}

interface CustomLineChartProps {
	data?: Array<Array<DataProps>>;
	fill?: boolean;
	solidSecondColor?: boolean;
}

const CustomLineChart = ({ data = [], fill, solidSecondColor }: CustomLineChartProps) => {
	const colors = useSelector(selectColors);

	let labels = data[0]?.map((item) => item.label) ?? [];
	if (!labels?.length) labels = data[1]?.map((item) => item.label) ?? [];

	const dataSet1 = data[0]?.map((item) => item.value) ?? [];
	const dataSet2 = data[1]?.map((item) => item.value) ?? [];

	return (
		<Chart
			type="line"
			style={{
				width: "100%",
				maxWidth: "100%",
				maxHeight: 400,
			}}
			options={{
				responsive: true,
				plugins: {
					legend: { display: false },
					title: { display: false },
					tooltip: {
						mode: "index",
						intersect: false,
						boxHeight: 10, // Height of the legend labels
						boxWidth: 10, // Width of the legend labels
						titleFont: {
							size: 18,
						},
						bodyFont: {
							size: 14,
						},
						callbacks: {
							title: (val) => val[0].label,
							label: (val: any) => "  $" + formatNumber(val.raw)?.toString(),
						},
					},
				},

				scales: {
					x: {
						border: { display: false },
						grid: { display: false },
						ticks: {
							font: { size: 14, weight: "500" },
							color: "#81839F",
						},
					},
					y: {
						border: {
							display: false,
							dash: [10, 6],
							color: colors.border,
						},
						grid: { drawTicks: false },
						ticks: {
							callback: (value: any) => "$" + formatNumber(value),
							font: { size: 15, weight: "500" },
							padding: 10,
							crossAlign: "far",
						},
						suggestedMin: 0,
						suggestedMax: 10,
					},
				},

				elements: {
					line: {
						tension: 0.4, // Adjust the tension value to change the curve shape (0.0 to 1.0)
					},
				},
			}}
			data={{
				labels,
				datasets: [
					{
						label: "Solar Panel",
						fill,
						data: dataSet1,
						borderColor: fill ? colors.successLight : colors.successLight,
						backgroundColor:
							fill && !solidSecondColor
								? (context) => {
										const chart = context.chart;
										const ctx = chart.ctx;
										const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
										gradient.addColorStop(0, colors.successLight + "fe"); // Start color
										gradient.addColorStop(1, colors.successLight + "25"); // End color (transparent)
										return gradient;
								  }
								: colors.successLight + "75",
						hoverBackgroundColor: colors.successLight,
						borderWidth: 1.5,
						pointRadius: 0.1,
					},
					{
						label: "Energy",
						fill,
						data: dataSet2,
						borderColor: fill ? colors.errorLight : "#FB665E",
						backgroundColor: fill
							? (context) => {
									const chart = context.chart;
									const ctx = chart.ctx;
									const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
									gradient.addColorStop(0, colors.errorLight + "fe"); // Start color
									gradient.addColorStop(1, colors.errorLight + "25"); // End color (transparent)
									return gradient;
							  }
							: "#FB665E",

						hoverBackgroundColor: "#FB665E",
						borderWidth: 1.5,
						pointRadius: 0.1,
					},
				],
			}}
		/>
	);
};

export default CustomLineChart;
