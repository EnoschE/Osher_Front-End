import React, { useEffect, useState } from "react";
import PageLayout from "../../PageLayout/PageLayout";
import { allRoutes } from "../../../Routes/AllRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerDetails } from "../../../Services/dashboardService";
import { toast } from "react-toastify";
import TechnicianCalendar from "./TechnicianCalendar";

const TechnicianCalendarView = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [technician, setTechnician] = useState<any>(null);

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async (onlyGetProject?: boolean) => {
		if (!id) navigate(allRoutes.TECHNICIANS);

		setLoading(!onlyGetProject);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());

			setTechnician(userData);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	return (
		<PageLayout loading={loading}>{technician && <TechnicianCalendar technicianId={technician._id} />}</PageLayout>
	);
};

export default TechnicianCalendarView;
