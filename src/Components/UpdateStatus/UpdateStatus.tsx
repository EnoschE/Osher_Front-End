import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import CustomTabs from "../Common/CustomTabs";
import {
	AppRegistrationOutlined,
	CalendarMonthRounded,
	CoPresentOutlined,
	DesignServicesOutlined,
	ElectricMeterOutlined,
	HandymanOutlined,
	ImageSearchOutlined,
	TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import SiteSurvey from "./SubPages/SiteSurvey";
import { useEffect, useState } from "react";
import CADDesign from "./SubPages/CADDesign";
import PermitApplication from "./SubPages/PermitApplication";
import Installation from "./SubPages/Installation";
import TownInspection from "./SubPages/TownInspection";
import Activation from "./SubPages/Activation";
import MeterReplacement from "./SubPages/MeterReplacement";
import UtilityInterconnection from "./SubPages/UtilityInterconnection";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { getCustomerDetails } from "../../Services/dashboardService";
// import { getCurrentStepOfCustomer } from "../../Services/installersService";
// import { isRepresentativeLoggedIn } from "../../Services/userService";
// import { allRoutes } from "../../Routes/AllRoutes";

export const allSteps = {
	SITE_SURVEY: { id: "site-survey", text: "Site Survey", icon: <CoPresentOutlined /> },
	CAD_DESIGN: { id: "cad-design", text: "CAD Design", icon: <DesignServicesOutlined /> },
	PERMIT_APPLICATION: {
		id: "permit-application",
		text: "Permit Application",
		icon: <AppRegistrationOutlined />,
	},
	UTILITY_INTERCONNECTION: {
		id: "utility-interconnection",
		text: "Utility Interconnection",
		icon: <CalendarMonthRounded />,
	},
	INSTALLATION: { id: "installation", text: "Installation", icon: <HandymanOutlined /> },
	TOWN_INSPECTION: {
		id: "town-inspection",
		text: "Town Inspection",
		icon: <ImageSearchOutlined />,
	},
	METER_REPLACEMENT: {
		id: "meter-replacement",
		text: "Meter Replacement",
		icon: <ElectricMeterOutlined />,
	},
	ACTIVATION: { id: "activation", text: "Activation", icon: <TipsAndUpdatesOutlined /> },
};

const UpdateStatus = () => {
	const { id } = useParams();

	const [tab, setTab] = useState("");
	const [loading, setLoading] = useState(false);
	const [customer, setCustomer] = useState<any>(null);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());

			const currentStep = userData?.currentStep || allSteps.SITE_SURVEY.text;
			const step = Object.values(allSteps).find((item) => item.text === currentStep)?.id;
			setTab(step || allSteps.SITE_SURVEY.id);
			setCustomer(userData);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleChangeTab = (newTab?: string) => {
		if (newTab) {
			setTab(newTab);
		}
	};

	return (
		<PageLayout
			loading={loading}
			// backButtonPath={
			// 	isRepresentativeLoggedIn()
			// 		? allRoutes.DASHBOARD
			// 		: allRoutes.VIEW_REPRESENTATIVE.replace(":id", customer?.installerId || "")
			// }
		>
			<Box>
				<CustomTabs options={Object.values(allSteps)} value={tab} onChange={handleChangeTab} />
			</Box>
			<Box pt={{ xs: 32, sm: 32 }}>
				{loading ? (
					<></>
				) : tab === allSteps.SITE_SURVEY.id ? (
					<SiteSurvey id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.CAD_DESIGN.id ? (
					<CADDesign id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.PERMIT_APPLICATION.id ? (
					<PermitApplication id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.UTILITY_INTERCONNECTION.id ? (
					<UtilityInterconnection id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.INSTALLATION.id ? (
					<Installation id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.TOWN_INSPECTION.id ? (
					<TownInspection id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.METER_REPLACEMENT.id ? (
					<MeterReplacement id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : tab === allSteps.ACTIVATION.id ? (
					<Activation id={customer?._id || ""} sequentialId={customer?.sequentialId || ""} />
				) : (
					<></>
				)}
			</Box>
		</PageLayout>
	);
};

export default UpdateStatus;
