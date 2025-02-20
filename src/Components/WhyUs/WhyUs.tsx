import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import GoogleConfirmationDialog from "./GoogleConfirmationDialog";
import { useSelector } from "../../Redux/reduxHooks";
import { BillDataState, selectUser } from "../../Redux/Slices/userSlice";
import { Box, Theme, useMediaQuery } from "@mui/material";
import {
	AppRegistrationOutlined,
	DescriptionOutlined,
	ElectricBoltOutlined,
	ForwardOutlined,
	SolarPowerOutlined,
	TrendingUpOutlined,
	TroubleshootOutlined,
	VerifiedUserOutlined,
} from "@mui/icons-material";
import CustomTabs from "../Common/CustomTabs";
import WelcomeBlock from "./WelcomeBlock";
import ElectricBillUpload from "./ElectricBillUpload";
import YourSolar from "./YourSolar";
import BillAnalysis from "./BillAnalysis";
import FinancialImpact from "./FinancialImpact";
import SelectPlan from "./SelectPlan";
import SolarReport from "../SolarReport/SolarReport";
import { toast } from "react-toastify";
import {
	getSolarSpecs,
	getFinancialImpactPayment,
	getFinancialImpactSavings,
	getPaymentOption,
	getSolarReport,
} from "../../Services/reportService";
import Loader from "../Common/Loader";
import { verifyAddress } from "../../Services/addressService";
import { getSatelliteImage, getStreetViewImage } from "../../Utils/utils";

const modules = {
	SUMMARY_PROPOSAL: {
		id: "summary-proposal",
		text: "Summary Proposal",
		icon: <AppRegistrationOutlined />,
		alwaysActive: true,
	},
	WELCOME: { id: "welcome", text: "Welcome", icon: <SolarPowerOutlined /> },
	ELECTRIC_BILL: { id: "electric-bill-upload", text: "Electric Bill Upload", icon: <ElectricBoltOutlined /> },
	BILL_ANALYSIS: { id: "bill-analysis", text: "Electric Bill Analysis", icon: <TroubleshootOutlined /> },
	YOUR_SOLAR: { id: "your-solar", text: "Your Solar", icon: <DescriptionOutlined /> },
	FINANCIAL_IMPACT: { id: "financial-impact", text: "Financial Impact", icon: <TrendingUpOutlined /> },
	GUARANTEES: { id: "guarantees", text: "Guarantees", icon: <VerifiedUserOutlined /> },
	NEXT_STEPS: { id: "next-steps", text: "Next Steps", icon: <ForwardOutlined /> },
};

const WhyUs = () => {
	const { state }: any = useLocation();
	const user = useSelector(selectUser);
	const satelliteImage = getSatelliteImage(user.address);
	const streetViewImage = getStreetViewImage(user.address);
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
	const isSocialLogin = state?.isSocialLogin;

	const [googleDialog, setGoogleDialog] = useState<boolean>(false);
	const [displaySummary, setDisplaySummary] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>({});
	const [billData, setBillData] = useState<BillDataState | null>(null);

	// ⚡️ TODOs for module 2 and 3:
	// ✅ display satellite image and streetView image on second section of whyUs page
	// ✅ by clicking on I don't have bill take user to bill analysis section
	// ✅ bill analysis should display an error if bill is not uploaded
	// ✅ check googleStaticStreetView api and add on report page
	// ✅ in financialImpact, for payment: divide the energy value/12 and display that and display same solar bill for all the years
	// ✅ add formatNumber on financialImpact chart
	// ✅ change payment prices on bill upload, just need to remove a return command form that component after BE got fixed
	// ✅ uncomment the pdf restriction in billUploader
	// ✅ in financialImpact, for Saving: first value should be 0 and last should be the largest value of 25 years savings
	// ✅ after payment deposited, change the status to scheduled
	// ✅ update status of survey on every step (scheduled, paymentdeposited, pending, completed)
	// find a way to upload the PDF bill and display through the uploaded link
	// get the details of uploaded bill (delivery, supply, provider), if user refreshes the page
	// check why apis on this page using user.address from estimate page

	useEffect(() => {
		if (isSocialLogin) {
			openGoogleDialog();
		}
		getDataOfDashboard();
	}, [user.id]);

	const getDataOfDashboard = async () => {
		if (!user.id) return;

		// checking if the user has already uploaded bill
		if (user.billData) {
			const savedBillData = {
				file: user.billData?.file,
				delivery: user.billData?.delivery,
				supply: user.billData?.supply,
				provider: user.billData?.provider,
			};
			setBillData(savedBillData);
		}

		setLoading(true);
		try {
			const monthlyBill = user.bill || "";
			const pv = 0.7;

			const { data: verification } = await verifyAddress(user.address || "1939 Irene St, West Covina, CA 91792, USA");
			if (verification.Isvalid === "Something went wrong") {
				toast.warn("We are sorry, but we are currently not operating in your area. Please try again in a few months.");
			} else {
				const [
					{ data: solarReport },
					{ data: solarSpecs },
					{ data: financialSavings },
					{ data: financialPayment },
					{ data: paymentOptions },
				] = await Promise.all([
					getSolarReport(user.bill || "200"),
					getSolarSpecs(monthlyBill),
					getFinancialImpactSavings(monthlyBill),
					getFinancialImpactPayment(monthlyBill),
					getPaymentOption(monthlyBill, pv),
				]);

				setData({ solarReport, solarSpecs, financialSavings, financialPayment, paymentOptions });
			}
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleChangeTab = (elementId?: string) => {
		if (!elementId) return;

		const isSummaryTabClicked = modules.SUMMARY_PROPOSAL.id === elementId;
		if (isSummaryTabClicked) {
			if (!displaySummary) setDisplaySummary(true);
		} else {
			if (displaySummary) setDisplaySummary(false);
		}
	};

	const handleUpdateBillData = (bill: any) => {
		setBillData(bill);
	};

	const openGoogleDialog = () => setGoogleDialog(true);
	const closeGoogleDialog = () => setGoogleDialog(false);

	return (
		<>
			<Navbar />
			<Loader open={loading} />
			<CustomTabs
				options={Object.values(modules)}
				onChange={handleChangeTab}
				value={displaySummary ? modules.SUMMARY_PROPOSAL.id : ""}
			/>
			<Box px={isSmallScreen ? 32 : 80}>
				{displaySummary ? (
					<SolarReport forDashboard dashboardData={data?.solarReport} />
				) : (
					<>
						<WelcomeBlock
							id={modules.WELCOME.id}
							user={user}
							satelliteImage={satelliteImage}
							streetViewImage={streetViewImage}
						/>
						<ElectricBillUpload
							id={modules.ELECTRIC_BILL.id}
							analysisModuleId={modules.BILL_ANALYSIS.id}
							onUpload={handleUpdateBillData}
							billData={billData}
						/>
						<BillAnalysis id={modules.BILL_ANALYSIS.id} billData={billData} />
						<YourSolar id={modules.YOUR_SOLAR.id} data={data.solarSpecs} streetViewImage={streetViewImage} />
						<FinancialImpact
							id={modules.FINANCIAL_IMPACT.id}
							financialSavings={data.financialSavings}
							financialPayment={data.financialPayment}
						/>
						<SelectPlan id={modules.GUARANTEES.id} data={data?.paymentOptions} />
						<Box id={modules.NEXT_STEPS.id} />
					</>
				)}
			</Box>

			<GoogleConfirmationDialog open={googleDialog} onClose={closeGoogleDialog} />
		</>
	);
};

export default WhyUs;
