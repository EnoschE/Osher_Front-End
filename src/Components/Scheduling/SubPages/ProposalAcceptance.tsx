import SchedulingPageLayout from "../SchedulingPageLayout";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import InformationBlock from "../InformationBlock";

const ProposalAcceptance = () => {
	const navigate = useNavigate();

	return (
		<SchedulingPageLayout>
			<InformationBlock
				title="Thank you for accepting the proposal"
				subtitle={
					<>
						To arrange a site survey, please proceed by clicking on <b>continue</b>
					</>
				}
				buttonText="Continue"
				buttonOnClick={() => navigate(allRoutes.SITE_SURVEY)}
			/>
		</SchedulingPageLayout>
	);
};

export default ProposalAcceptance;
