import { Box, Typography } from "@mui/material";
import { BorderedBox } from "./whyUsStyles";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import CustomBarChart from "../Common/Charts/CustomBarChart";
import { useEffect, useState } from "react";
import CustomMenu from "../Common/CustomMenu";
import { formatNumber } from "../../Utils/utils";

const defaultChartData = [
	{ value: 0, label: "Jan" },
	{ value: 0, label: "Feb" },
	{ value: 0, label: "Mar" },
	{ value: 0, label: "Apr" },
	{ value: 0, label: "May" },
	{ value: 0, label: "Jun" },
	{ value: 0, label: "Jul" },
	{ value: 0, label: "Aug" },
	{ value: 0, label: "Sep" },
	{ value: 0, label: "Oct" },
	{ value: 0, label: "Nov" },
	{ value: 0, label: "Dec" },
];

const defaultMenuOptions = [{ text: 2023 }];

export interface BillData {
	year: string | number;
	AnnualBill: string | number;
}

interface UtilityBillIncreasingProps {
	id?: string;
	mt?: string | number;
	sx?: any;
	yearlyBills?: Array<BillData>;
}

const UtilityBillIncreasing = ({ id, mt = 80, sx, yearlyBills = [] }: UtilityBillIncreasingProps) => {
	const [year, setYear] = useState<number | string>("");
	const [data, setData] = useState<Array<any>>(defaultChartData);
	const [options, setOptions] = useState<Array<any>>(defaultMenuOptions);

	useEffect(() => {
		if (yearlyBills?.length) {
			setYear(yearlyBills?.[0]?.year);
			const allYears = yearlyBills.map((item) => ({ text: item.year, onClick: () => handleChangeYear(item.year) }));
			setOptions(allYears);
		}
	}, [yearlyBills]);

	useEffect(() => {
		if (year) {
			findDataOfSelectedYear();
		}
	}, [year, yearlyBills]);

	const findDataOfSelectedYear = () => {
		let averageBill = yearlyBills.find((item) => item.year === year)?.AnnualBill || 0;
		averageBill = formatNumber(parseFloat(averageBill?.toString()) / 12);
		const allMonthsBills = defaultChartData.map((item) => ({ ...item, value: averageBill }));
		setData(allMonthsBills);
	};

	const handleChangeYear = (yearValue: string | number) => {
		setYear(yearValue);
	};

	const highestBill = data[0]?.value;

	return (
		<Box id={id} sx={sx}>
			<Typography variant="h2" mt={mt} mb={10}>
				Your Utility Bill is Increasing
			</Typography>
			<Typography fontSize={16} mb={20} maxWidth={620}>
				A utility bill audit is a comprehensive review of an organization's utility invoices to include Electric, Gas,
				Water/Sewer and Waste invoices in order to track billing errors
			</Typography>
			<BorderedBox>
				<Box display="flex" justifyContent="space-between">
					<Typography variant="h4" color="primary">
						${formatNumber(highestBill)}
					</Typography>

					{!!year && (
						<CustomMenu
							anchorComponent={(props: any) => (
								<Box display="flex" alignItems="center" gap={8} sx={{ cursor: "pointer" }} {...props}>
									<Typography variant="h6">{year}</Typography>
									<KeyboardArrowDownOutlined />
								</Box>
							)}
							options={options}
						/>
					)}
				</Box>
				<Typography fontSize={16} mt={8} mb={38}>
					Highest bill in {year}
				</Typography>

				<CustomBarChart data={data} />
			</BorderedBox>
		</Box>
	);
};

export default UtilityBillIncreasing;
