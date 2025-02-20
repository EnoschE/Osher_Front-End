import { Box, Typography } from "@mui/material";
import { BorderedBox, GrayBoxForDetails } from "./whyUsStyles";
import CustomLineChart from "../Common/Charts/CustomLineChart";
import CustomToggleButton from "../Common/CustomToggleButton";
import { useEffect, useState } from "react";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { formatNumber } from "../../Utils/utils";

const financialOptions = {
	PAYMENT: { text: "Payment", value: 1 },
	SAVING: { text: "Saving", value: 2 },
};

const FinancialImpact = ({
	id,
	financialPayment,
	financialSavings,
}: {
	id?: string;
	financialPayment?: any;
	financialSavings?: any;
}) => {
	const colors = useSelector(selectColors);

	const [option, setOption] = useState<number | string>(financialOptions.PAYMENT.value);
	const [paymentData, setPaymentData] = useState<any>(financialPayment);
	const [savingsData, setSavingsData] = useState<any>(financialSavings);

	useEffect(() => {
		setPaymentData(financialPayment);
		setSavingsData(financialSavings);
	}, [financialPayment, financialSavings]);

	const paymentValues = [
		{ value: paymentData?.monthlyBill, description: "Current month utility bill", isLoss: true },
		{
			value: paymentData?.SolarSavingMonth,
			description: "Month solar payment",
			isProfit: true,
		},
		{ value: 0, description: "Utility bill after solar" },
	];

	const savingValues = [
		{
			value: savingsData?.costOfElectricityWithoutSolar,
			description: "Cost of doing nothing",
			isLoss: true,
		},
		{
			value: savingsData?.totalSavings20Years,
			description: "Total estimated solar saving",
			isProfit: true,
		},
	];

	const paymentsArray = paymentData?.TotalSolarSavings20years ?? [];
	const energyData = paymentsArray?.map((item: any) => ({ value: item?.MonthlyBill, label: item?.year })) ?? [];
	const solarData = paymentsArray?.map((item: any) => ({ value: item?.Solarsavingpermonth, label: item?.year })) ?? [];
	const savingsChartData =
		savingsData?.savingsArray?.map((item: any) => ({ value: item?.SolarSavingYear, label: item?.year })) ?? [];

	const chartDataForPayment = [solarData, energyData];
	const chartDataForSavings = [savingsChartData, []];

	const isPaymentSelected = option === financialOptions.PAYMENT.value;

	return (
		<Box id={id}>
			<Typography variant="h2" mt={60} mb={10}>
				Financial Impact
			</Typography>
			<Typography fontSize={16} mb={20} maxWidth={620}>
				Financial Impact means either a decrease in the value of the assets or an increase in the losses and liabilities
				pertaining to the assets,
			</Typography>
			<BorderedBox>
				<Box display="flex" justifyContent="center" mb={48}>
					<CustomToggleButton
						value={option}
						onChange={(val) => setOption(val)}
						options={Object.values(financialOptions)}
					/>
				</Box>

				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					flexDirection={{ xs: "column", sm: "row" }}
					gap={32}
					mb={42}
				>
					{(isPaymentSelected ? paymentValues : savingValues).map((item, idx) => (
						<GrayBoxForDetails key={idx}>
							<Typography
								variant="h2"
								fontSize={40}
								color={item.isLoss ? "error.dark" : item.isProfit ? "success.main" : ""}
							>
								${formatNumber(item.value || 0)}
							</Typography>
							<Typography fontSize={16}>{item.description}</Typography>
						</GrayBoxForDetails>
					))}
				</Box>

				{isPaymentSelected && (
					<Box display="flex" alignItems="center" gap={8} mb={32}>
						<Box sx={{ height: 19, width: 19, borderRadius: borderRadius.xs, bgcolor: colors.errorLight }} />
						<Typography fontSize={16} mr={14}>
							Energy
						</Typography>
						<Box sx={{ height: 19, width: 19, borderRadius: borderRadius.xs, bgcolor: colors.success }} />
						<Typography fontSize={16}>Solar</Typography>
					</Box>
				)}

				<CustomLineChart
					data={isPaymentSelected ? chartDataForPayment : chartDataForSavings}
					fill
					solidSecondColor={isPaymentSelected}
				/>
			</BorderedBox>
		</Box>
	);
};

export default FinancialImpact;
