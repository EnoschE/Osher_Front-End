import {
	AppRegistrationOutlined,
	CoPresentOutlined,
	DesignServicesOutlined,
	DrawOutlined,
	HandymanOutlined,
	ImageSearchOutlined,
	ThumbUpOutlined,
	TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import CustomTabs from "../Common/CustomTabs";
import { allRoutes } from "../../Routes/AllRoutes";
import { useNavigate } from "react-router-dom";

const schedulingComponents = {
	PROPOSAL_ACCEPTANCE: { id: allRoutes.PROPOSAL_ACCEPTANCE, text: "Proposal Acceptance", icon: <ThumbUpOutlined /> },
	SITE_SURVEY: { id: allRoutes.SITE_SURVEY, text: "Site Survey", icon: <CoPresentOutlined /> },
	CAD_DESIGN: { id: allRoutes.CAD_DESIGN, text: "CAD Design", icon: <DesignServicesOutlined /> },
	CONTRACT_SIGNING: { disabled: true, id: "contract-signing", text: "Contract Signing", icon: <DrawOutlined /> },
	PERMIT_INTERCONNECTION: {
		disabled: true,
		id: "permit-inter-con",
		text: "Permit & Interconnection",
		icon: <AppRegistrationOutlined />,
	},
	INSTALLATION: { disabled: true, id: "installation", text: "Installation", icon: <HandymanOutlined /> },
	TOWN_INSPECTION: {
		disabled: true,
		id: "town-inspection",
		text: "Town Inspection & Meter Replacement",
		icon: <ImageSearchOutlined />,
	},
	ACTIVATION: { disabled: true, id: "activation", text: "Activation", icon: <TipsAndUpdatesOutlined /> },
};

const SchedulingTabs = ({ value }: { value?: string }) => {
	const navigate = useNavigate();

	const handleChangeTab = (pageUrl?: string) => {
		if (pageUrl) navigate(pageUrl);
	};

	return (
		<CustomTabs
			value={value}
			onChange={handleChangeTab}
			scrollingTabs={false}
			options={Object.values(schedulingComponents)}
		/>
	);
};

export default SchedulingTabs;
