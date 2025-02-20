import PageLayout from "../PageLayout/PageLayout";
import DashboardData from "./DashboardData";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailsOfInstaller } from "../../Services/dashboardService";
import { toast } from "react-toastify";
import { roles } from "../../Utils/tokenKeyValue";

const RoleBasedDashboard = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		if (!id) {
			navigate(-1);
		}

		getDetails();
	}, []);

	async function getDetails() {
		setLoading(true);
		try {
			const { data } = await getDetailsOfInstaller((id || "")?.toString());
			if (![roles.TECHNICIAN, roles.CUSTOMER].includes(data.role)) {
				setData(data);
			} else {
				navigate(-1);
			}
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	}

	return (
		<PageLayout loading={loading}>
			{data && (
				<DashboardData
					id={data._id}
					role={data.role}
					loading={loading}
					setLoading={setLoading}
					funnelName={`${data.name} Funnel`}
				/>
			)}
		</PageLayout>
	);
};

export default RoleBasedDashboard;
