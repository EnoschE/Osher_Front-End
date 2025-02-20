import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allRoutes } from "../../../Routes/AllRoutes";
import PageLayout from "../../PageLayout/PageLayout";
import { getAllRepresentatives } from "../../../Services/dashboardService";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import TableBlock from "../../Common/Table/TableBlock";
import CustomTableOptions from "../../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";

const Representatives = () => {
	const navigate = useNavigate();
	const user = useSelector(selectUser);

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{ representatives?: Array<any> }>({ representatives: [] });

	useEffect(() => {
		getAllUsers();
	}, [user]);

	const getAllUsers = async () => {
		if (!user.id) return;

		setLoading(true);
		try {
			// if (isAdmin || isOfficeManager) {
			let { data } = await getAllRepresentatives();
			if (data) data = data.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));
			setData({ representatives: data });
			// } else if (isManager) {
			// 	const { data } = await getRepresentativesOfManager((user.id || "")?.toString());
			// 	setData({ representatives: data });
			// }
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const tableHeaders = [
		{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
		{ text: "Name", key: "name", sortable: true },
		{ text: "Email address", key: "email", sortable: true },
		{ text: "Company Name", key: "company", sortable: true },
		{ text: "Email Status", key: "isEmailVerified" , customComponent : (props:any)=>(props.fullObject.isEmailVerified ? "Verified" :  "Not Verified") },

		{
			text: "",
			key: "",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => (
				<CustomTableOptions
					menuOptions={[
						{
							text: "View Dashboard",
							onClick: () => navigate(allRoutes.VIEW_REPRESENTATIVE_DASHBOARD.replace(":id", props.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading={"Representatives"}
				subHeading={`These are all the representatives in this company:`}
				tableData={data.representatives}
				detailsPagePath={allRoutes.VIEW_REPRESENTATIVE}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no representatives present. Please add a representative"}
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default Representatives;
