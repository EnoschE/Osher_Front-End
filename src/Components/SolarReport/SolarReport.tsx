import { useEffect, useState } from "react";
import { Box, Divider, Theme, Typography, useMediaQuery } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/Slices/userSlice";
import CustomButton from "../Common/CustomButton";
import { SolarReportContainer, GrayBlock, SolarReportRightColumn } from "./solarReportStyles";
import CustomDoughnutChart from "../Common/Charts/CustomDoughnutChart";
import UtilityBillIncreasing, { BillData } from "../WhyUs/UtilityBillIncreasing";
import BarWithValue from "./BarWithValue";
import DashedBoxWithValues from "./DashedBoxWithValues";
import BillBlock from "./BillBlock";
import { HomeImage } from "../../Utils/Images";
import useScrollPercentage from "../../Hooks/useScrollPercentage";
import { toast } from "react-toastify";
import { getSolarReport } from "../../Services/reportService";
import Loader from "../Common/Loader";
import { formatNumber, getSatelliteImage, getStreetViewImage } from "../../Utils/utils";
import { selectColors } from "../../Redux/Slices/generalSlice";

const SolarReport = ({ forDashboard, dashboardData }: { forDashboard?: boolean; dashboardData?: any }) => {
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const scrollPercentage = useScrollPercentage();
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
	const colors = useSelector(selectColors);

	// TODO in future: create PageLayout and move Navbar in that component and also move page padding in that as well and handle responsive padding there

	const [loading, setLoading] = useState<boolean>(false);
	const [yearlyBills, setYearlyBills] = useState<Array<BillData>>([]);
	const [data, setData] = useState<any>({});

	useEffect(() => {
		window.scrollTo(0, 0);
		if ((!user.address || !user.bill) && !forDashboard) {
			navigate(allRoutes.ESTIMATE);
		} else {
			fetchSolarReportData();
		}
	}, [dashboardData]);

	const fetchSolarReportData = async () => {
		if (forDashboard) {
			return handleSetValues(dashboardData);
		}

		setLoading(true);
		try {
			const { data: response } = await getSolarReport(user.bill || "200");

			handleSetValues(response);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleSetValues = (response: any) => {
		setData(response);
		setYearlyBills(response?.yearlyBills || []);
	};

	const handleNext = () => {
		navigate(allRoutes.SIGN_UP);
	};

	const maxHeightOfBlock = 300;
	const heightOfElectricBlock =
		(data?.totalAnnualBill20years / (data?.totalAnnualBill20years + data?.trueSolarSaving25years || 1)) *
			maxHeightOfBlock || 250;
	const heightOfSavingsBlock =
		(data?.trueSolarSaving25years / (data?.totalAnnualBill20years + data?.trueSolarSaving25years || 1)) *
			maxHeightOfBlock || 250;

	const displayFirstElement = isSmallScreen ? true : scrollPercentage < 33;
	const displaySecondElement = isSmallScreen ? true : scrollPercentage >= 33 && scrollPercentage < 66;
	const displayThirdElement = isSmallScreen ? true : scrollPercentage >= 66;

	// const annualBill1month = data?.yearlyBills?.[0]?.AnnualBill ?? 0;
	// const annualBill20years = data?.yearlyBills?.[data?.yearlyBills?.length - 1]?.AnnualBill ?? 0;
	const annualBill1month = data?.billAfter1Year ?? 0;
	const annualBill20years = data?.billAfter20Years ?? 0;

	return (
		<>
			{!forDashboard && <Navbar />}
			<Loader open={loading} />

			<SolarReportContainer forDashboard={forDashboard}>
				<Box>
					<Typography variant="h4">Solar looks good on you 😎</Typography>
					<Divider sx={{ mt: 20, mb: 24 }} />
					<Typography variant="h5" mb={10}>
						Your House
					</Typography>
					<img className="left-image" src={getSatelliteImage(user.address)} alt="" />
					<Typography variant="body2" mt={10}>
						{user.address || "Your house address"}
					</Typography>
					<Typography variant="h5" mt={30}>
						Your Electric Bill
					</Typography>

					<GrayBlock sx={{ backgroundColor: colors.lightGray }} mt={16}>
						<Typography variant="h6" fontWeight={600}>
							Current monthly bill
						</Typography>
						<Typography variant="h2" fontWeight={500} mt={16} mb={8}>
							${formatNumber(user.bill || data?.monthlyBill)}
						</Typography>
						<Typography variant="body2" color={"text.secondary"} mt={8} mb={24}>
							On average electricity bills increase by{" "}
							<Typography variant="body2" component="span" color="success.main">
								+3.8%
							</Typography>{" "}
							per year
						</Typography>

						<BillBlock
							hideIcon
							title="Your yearly electricity expense"
							bill={formatNumber(data?.billAfter1Year)}
							isLoss
						/>
						<BillBlock
							hideIcon
							title="Estimated 10 year electricity expense"
							bill={formatNumber(data?.billAfter10Years)}
							mt={8}
							isLoss
						/>

						<Typography variant="h6" fontWeight={600} mt={26} mb={19}>
							Estimated electricity expense over 25 years
						</Typography>
						<BillBlock isLoss title="" bill={formatNumber(data?.billAfter20Years)} />
						<Typography mt={12} mb={20} color="text.secondary">
							Modest but steady increase over time leads to huge expenses
						</Typography>
					</GrayBlock>

					<GrayBlock sx={{ backgroundColor: colors.lightGray }} mt={18}>
						<Typography variant="h6" fontWeight={600}>
							Your Solar System
						</Typography>
						<Typography variant="h2" fontWeight={500} mt={16} mb={8}>
							{data?.SystemSizeKW?.toLocaleString()}kW Solar
						</Typography>
						<Typography mb={6} color="text.secondary">
							This is the power of your solar system, sometimes referred to as the system size
						</Typography>

						<BillBlock
							hideIcon
							title="System production"
							bill={formatNumber(data?.systemProduction)}
							customUnit=" kW/h"
						/>

						<Typography variant="h6" fontWeight={600} mt={14} mb={36}>
							Electricity Usage
						</Typography>

						<Box width={192} mx={"auto"}>
							<CustomDoughnutChart value={100} />
						</Box>

						<Box display="flex" alignItems="center" justifyContent="space-between" mt={35} gap={10}>
							<Typography variant="h6" fontWeight={600}>
								Utility Usages: 0%
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								Solar Usages:{" "}
								<Typography variant="inherit" fontWeight="inherit" component="span" color="success.main">
									100%
								</Typography>
							</Typography>
						</Box>

						<BillBlock
							hideIcon
							title={
								<span>
									{formatNumber(data?.panelCount)} Q Cell 250 W Solar Panels <br />
									{formatNumber(data?.panelCount)} Enphase Micro Inverters
								</span>
							}
							mt={35}
						/>
						<Typography variant="h6" fontWeight={600} my={25}>
							No Out of Pocket Expenses
						</Typography>
						<BillBlock
							hideIcon
							title="We handle solar design, permitting and installation 25 year warranty includes maintenance and monitoring"
						/>
					</GrayBlock>

					<GrayBlock sx={{ backgroundColor: colors.lightGray }} mt={18}>
						<Typography variant="h6" fontWeight={600}>
							Monthly bill with solar
						</Typography>
						<Typography variant="h2" fontWeight={500} mt={16} mb={8}>
							${formatNumber(data?.solarSavingMonth1)}
						</Typography>
						<Typography variant="body2" color={"text.secondary"} mt={8} mb={16}>
							Your solar bill is fixed and will not increase
						</Typography>

						<BillBlock hideIcon title="Your first year solar savings" bill={formatNumber(data?.solarSavingYear1)} />
						<BillBlock
							hideIcon
							title="Estimated 10 year solar savings"
							bill={formatNumber(data?.solarSavingYear10)}
							mt={8}
						/>
					</GrayBlock>

					<GrayBlock sx={{ backgroundColor: colors.lightGray }} mt={18}>
						<Typography variant="h6" fontWeight={600} mb={18}>
							Avoided Electricity Expense over 25 years
						</Typography>
						<BillBlock bill={formatNumber(data?.solarSavingYear25)} />
						<Typography mt={12} color="text.secondary">
							Modest but steadily increasing savings over time lead to huge cash flows
						</Typography>
					</GrayBlock>

					<BillBlock
						hideIcon
						title={`Avoid $${formatNumber(data?.solarSavingYear25)} in grid charges by going solar`}
						mt={19}
						mb={forDashboard ? 0 : 27}
					/>

					{!forDashboard && (
						<CustomButton fullWidth onClick={handleNext}>
							Continue to unlock the proposal
						</CustomButton>
					)}
				</Box>

				<SolarReportRightColumn forDashboard={forDashboard} sx={{ backgroundColor: colors.primaryExtraLight }}>
					{displayFirstElement && (
						<Box
							className="fade-in-block"
							sx={{
								px: { xs: 20, sm: 40 },
								py: 10,
								my: "auto",
							}}
						>
							<UtilityBillIncreasing mt={0} yearlyBills={yearlyBills} />
						</Box>
					)}
					{displaySecondElement && (
						<img
							className="right-image fade-in-block"
							src={getStreetViewImage(user.address) || HomeImage}
							alt=""
							style={{ objectFit: "cover" }}
						/>
					)}
					{displayThirdElement && (
						<Box className="fade-in-block" sx={{ p: { xs: 20, sm: 40 }, my: "auto" }}>
							<Box display="flex" alignItems="flex-end" justifyContent="center" gap={{ xs: 20, sm: 70 }}>
								<BarWithValue
									height={heightOfElectricBlock}
									value={data?.totalAnnualBill20years}
									subtext="Stay with electric"
								/>
								<BarWithValue
									height={heightOfSavingsBlock}
									value={data?.trueSolarSaving25years}
									subtext="Switch to solar"
									isSolar
								/>
							</Box>

							<Box display="flex" flexDirection="column" gap={24} mt={42} width={{ xs: "100%", sm: 550 }} mx="auto">
								<DashedBoxWithValues
									leftValue={{ value: data?.monthlyBill, text: "Current average bill" }}
									rightValue={{ value: data?.monthlyBill20Years, text: "Average bill in 25 years" }}
								/>
								<DashedBoxWithValues
									leftValue={{ value: annualBill1month, text: "Annual utility bill" }}
									rightValue={{ value: annualBill20years, text: "Annual utility bill in 25 years" }}
								/>
								<DashedBoxWithValues
									isWhiteBox
									leftValue={{ value: data?.costOfDoingNothing, text: "25 year cost of doing nothing" }}
								/>
							</Box>
						</Box>
					)}
				</SolarReportRightColumn>
			</SolarReportContainer>
		</>
	);
};

export default SolarReport;
