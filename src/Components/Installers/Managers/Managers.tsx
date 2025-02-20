import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allRoutes } from "../../../Routes/AllRoutes";
import PageLayout from "../../PageLayout/PageLayout";
import { getAllManagers } from "../../../Services/dashboardService";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import TableBlock from "../../Common/Table/TableBlock";
import { useNavigate } from "react-router-dom";
import CustomTableOptions from "../../Common/CustomTableOptions";

const Managers = () => {
	const navigate = useNavigate();
	const user = useSelector(selectUser);

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{ managers?: Array<any> }>({ managers: [] });

	useEffect(() => {
		getAllUsers();
	}, [user]);

	const getAllUsers = async () => {
		if (!user.id) return;

		setLoading(true);
		try {
			// if (isAdmin) {
			let { data } = await getAllManagers();
			if (data) data = data.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));
			setData({ managers: data });
			// } else if (isOfficeManager) {
			// 	const { data } = await getManagersOfOfficeManager((user.id || "")?.toString());
			// 	setData({ managers: data });
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
							onClick: () => navigate(allRoutes.VIEW_MANAGER_DASHBOARD.replace(":id", props.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading={"Managers"}
				subHeading={`These are all the managers in this company:`}
				tableData={data.managers}
				// addButtonText={isOfficeManager ? "Add Manager" : ""}
				// addButtonPath={isOfficeManager ? allRoutes.ADD_MANAGER : ""}
				// addButtonState={isOfficeManager ? { officeManagerId: user.id } : null}
				detailsPagePath={allRoutes.VIEW_MANAGER}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no managers present. Please add a manager"}
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default Managers;
