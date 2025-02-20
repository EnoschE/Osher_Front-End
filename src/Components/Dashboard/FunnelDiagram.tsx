import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { getFunnelDataForStep } from "../../Services/installersService";
import FunnelCustomersDialog from "./FunnelCustomersDialog";
import { FunnelFiltersState, funnelUnits } from "./FiltersPopover";
import { formatNumber } from "../../Utils/utils";

interface FunnelData {
	[key: string]: {
		count: number;
		id: number;
		name: string;
		enum: string;
	};
}

interface FunnelDiagramProps {
	data: FunnelData;
	funnelName: string;
	installerId?: string;
	filters: FunnelFiltersState;
}

const FunnelDiagram: React.FC<FunnelDiagramProps> = ({ data, funnelName, installerId, filters }) => {
	const colors = useSelector(selectColors);

	const [openCustomersDialog, setOpenCustomersDialog] = useState<boolean>(false);
	const [customers, setCustomers] = useState<any>(null);
	const [selectedStep, setSelectedStep] = useState<any>(null);
	const [reRender, setReRender] = useState<boolean>(false);
	const [displayAnimation, setDisplayAnimation] = useState<boolean>(true);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (filters.unit || filters.timeFilter || filters.minDate || filters.maxDate) {
			if (!isFirstRender.current) {
				setDisplayAnimation(false);
			} else {
				isFirstRender.current = false;
			}
		}

		setReRender(false);
		setTimeout(() => {
			setReRender(true);
		}, 0);
	}, [data, filters]);

	const findCountById = (id: number) => {
		const item = Object.values(data).find((obj) => obj.id === id);
		return item ? item.count : null;
	};
	const findEnumById = (id: number) => {
		const item = Object.values(data).find((obj) => obj.id === id);
		return item ? item.enum : null;
	};

	const getCountWithUnit = (count: number | null) =>
		`${filters.unit === funnelUnits.DOLLAR ? "$" : ""}${formatNumber(count?.toString() || "0")}${
			filters.unit === funnelUnits.CONVERSION_RATE ? "%" : filters.unit === funnelUnits.KILO_WATT ? "kW" : ""
		}`;

	const initialColors = generatePurpleGradient(colors.primaryMidLight, colors.primary, Object.values(data).length);

	const chartHeight = 650;
	const series = [{ name: "", data: Object.values(data).map((obj) => obj.id) }];
	const options = {
		chart: {
			type: "bar",
			height: chartHeight,
			events: {
				click: async (event: any, chartContext: any, { dataPointIndex }: any) => {
					const clickedId = series[0].data[dataPointIndex];
					const step = findEnumById(clickedId);

					if (step && !!clickedId) {
						const { data } = await getFunnelDataForStep(step, installerId, filters);
						setOpenCustomersDialog(true);
						setCustomers(data);
						setSelectedStep(step);

						console.log(data);

						const activeColor = colors.primary;
						// Copy the initial colors
						const newColors = [...initialColors];
						// Change only the clicked bar's color
						newColors[dataPointIndex] = activeColor;

						// Update the chart with the new colors
						chartContext.updateOptions({
							colors: newColors,
						});
					}
				},
			},
			animations: {
				enabled: displayAnimation,
			},
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				horizontal: true,
				barHeight: "80%",
				distributed: true,
				isFunnel: true,
			},
		},
		states: {
			active: {
				filter: {
					type: "none", // No filter on active to directly apply the color
				},
				styles: {
					fill: colors.primary, // Dark purple color on click
				},
			},
			hover: {
				filter: {
					type: "none", // No change on hover
				},
			},
		},
		colors: initialColors,
		dataLabels: {
			enabled: true,
			style: {
				fontSize: "14px",
				fontWeight: 500,
				color: ["white"],
				fontFamily: "inherit",
			},
			dropShadow: {
				enabled: true,
				left: 1.5,
				top: 1.5,
				opacity: 0.9,
				color: colors.text,
			},
			formatter: (val: any, opt: any) => {
				const count = findCountById(val);
				return `${opt.w.globals.labels[opt.dataPointIndex]} (${getCountWithUnit(count)})`;
			},
		},
		tooltip: {
			enabled: true,
			custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
				// Use the utility function to find the count by id for the tooltip
				const id = series[seriesIndex][dataPointIndex];
				const count = findCountById(id);
				return `<div class="arrow_box" style="padding: 8px; font-size: 12px; font-weight: 500;">
						<span>${w.globals.labels[dataPointIndex]}: <span style="font-weight: 600;">${getCountWithUnit(count)}</span></span>
					  </div>`;
			},
		},
		title: {
			text: funnelName || "Customers Funnel",
			align: "left", // Aligning title to the left for a modern look
			style: {
				fontWeight: "600",
				fontSize: "24px",
				color: colors.text,
			},
		},
		xaxis: {
			categories: Object.values(data).map((obj) => obj.name),
		},
		legend: {
			show: false,
		},
	};

	const onClose = () => {
		setOpenCustomersDialog(false);
	};

	return (
		<div>
			<div id="chart">
				{reRender && <ReactApexChart options={options as any} series={series} type="bar" height={chartHeight} />}
			</div>

			<div id="html-dist"></div>

			<FunnelCustomersDialog
				open={openCustomersDialog}
				onClose={onClose}
				customers={customers}
				selectedStep={selectedStep}
			/>
		</div>
	);
};

export default FunnelDiagram;

function generatePurpleGradient(startColor: any, endColor: any, steps: any) {
	const start = {
		hex: startColor.replace("#", ""),
		r: parseInt(startColor.slice(1, 3), 16),
		g: parseInt(startColor.slice(3, 5), 16),
		b: parseInt(startColor.slice(5, 7), 16),
	};
	const end = {
		hex: endColor.replace("#", ""),
		r: parseInt(endColor.slice(1, 3), 16),
		g: parseInt(endColor.slice(3, 5), 16),
		b: parseInt(endColor.slice(5, 7), 16),
	};
	const diff = {
		r: end.r - start.r,
		g: end.g - start.g,
		b: end.b - start.b,
	};

	const stepsArray = [];
	for (let i = 0; i < steps; i++) {
		const r = start.r + (diff.r / (steps - 1)) * i;
		const g = start.g + (diff.g / (steps - 1)) * i;
		const b = start.b + (diff.b / (steps - 1)) * i;
		stepsArray.push(
			`#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b)
				.toString(16)
				.padStart(2, "0")}`,
		);
	}
	return stepsArray;
}
