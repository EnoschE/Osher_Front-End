import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";

const Scheduling = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(allRoutes.PROPOSAL_ACCEPTANCE);
	}, []);

	return <></>;
};

export default Scheduling;
