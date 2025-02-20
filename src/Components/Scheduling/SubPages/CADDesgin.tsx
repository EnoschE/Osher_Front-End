import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CustomStepper from "../../Common/CustomStepper";
import { CheckCircleOutline, EventRepeatOutlined, LoopOutlined } from "@mui/icons-material";
import SchedulingPageLayout from "../SchedulingPageLayout";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import InformationBlock from "../InformationBlock";
import { navbarHeight, tabsHeight } from "../../../Utils/spacings";

const steps = [
	{ text: "Requested", icon: <EventRepeatOutlined />, status: 0 },
	{ text: "In progress", icon: <LoopOutlined />, status: 1 },
	{ text: "Completed", icon: <CheckCircleOutline />, status: 2 },
];

const CADDesign = () => {
	const navigate = useNavigate();

	const [status, setStatus] = useState<null | any>(0);

	useEffect(() => {
		// call api here to get the latest status of process
		setStatus(0);
		// setStatus(1);
		// setStatus(2);
	}, []);

	return (
		<SchedulingPageLayout>
			<InformationBlock
				title={
					<>
						Your CAD design{" "}
						<Typography variant="inherit" component="span" color="primary.main">
							is requested
						</Typography>
					</>
				}
				subtitle="You will be notified as soon as the design has completed Please check again later."
				buttonText="Back To Home"
				buttonOnClick={() => navigate(allRoutes.PROPOSAL_ACCEPTANCE)}
				height={`calc(100vh - ${navbarHeight}px - ${tabsHeight}px  - 185px)`}
			/>

			<Box pt={42} maxWidth={640} mx="auto" mb={{ xs: 32, sm: 70 }}>
				<CustomStepper steps={steps} activeStep={status} />
			</Box>
		</SchedulingPageLayout>
	);
};

export default CADDesign;
