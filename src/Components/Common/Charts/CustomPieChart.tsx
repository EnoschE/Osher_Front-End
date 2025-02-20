import { Chart } from "react-chartjs-2";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";

import ChartDataLabels from "chartjs-plugin-datalabels";

export interface DataSetProps {
	label?: string;
	value?: string | number;
	color?: string;
}

interface CustomPieChartProps {
	size?: number | string;
	fontSize?: number;
	dataSets?: Array<DataSetProps>;
}

const CustomPieChart = ({ size = "100%", fontSize = 20, dataSets = [] }: CustomPieChartProps) => {
	const colors = useSelector(selectColors);

	const labels = dataSets.map((item) => item.label ?? "");
	const values = dataSets.map((item) => item.value ?? 0);
	// const bgColors = dataSets.map((item) => item.color);

	return (
		<div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Chart
				type="pie"
				data={{
					labels: labels || ["Delivery", "Supply"],
					datasets: [
						{
							data: values || [1116, 1364],
							backgroundColor: [colors.primary, colors.lightGray],
						},
					],
				}}
				options={{
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: { display: false },
						tooltip: { enabled: false },
						datalabels: {
							font: {
								size: fontSize,
								weight: 600,
							},
							textAlign: "center",

							color: (context) => {
								const bgColors = context.dataset?.backgroundColor?.toString();
								const splits = bgColors?.split(",") ?? [];
								const bgColor = splits[context.dataIndex] ?? "";

								let color = colors.text;
								if (bgColor === colors.primary) {
									color = "white";
								}
								return color;
							},

							formatter(value, context) {
								const labels = context.chart.data.labels?.join(" - ");
								const splits = labels?.split(" - ") ?? [];
								const label = splits[context.dataIndex] ?? "";

								return label + "\n" + `$${value?.toLocaleString()}`;
							},
						},
					},
				}}
				plugins={[ChartDataLabels]}
				style={{ maxWidth: "100%" }}
			/>
		</div>
	);
};
export default CustomPieChart;
