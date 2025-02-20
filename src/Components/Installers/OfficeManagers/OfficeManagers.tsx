import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allRoutes } from "../../../Routes/AllRoutes";
import PageLayout from "../../PageLayout/PageLayout";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import TableBlock from "../../Common/Table/TableBlock";
import { getAllOfficeManagers } from "../../../Services/dashboardService";
import CustomTableOptions from "../../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";

const OfficeManagers = () => {
	const navigate = useNavigate();
	const user = useSelector(selectUser);

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{ officeManagers?: Array<any> }>({ officeManagers: [] });

	useEffect(() => {
		getAllUsers();
	}, [user]);

	const getAllUsers = async () => {
		if (!user.id) return;

		setLoading(true);
		try {
			let { data } = await getAllOfficeManagers();

			if (data) data = data.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));

			setData({ officeManagers: data });
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
							onClick: () => navigate(allRoutes.VIEW_OFFICE_MANAGER_DASHBOARD.replace(":id", props.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading={"Office Managers"}
				subHeading={`These are all the office managers in this company:`}
				tableData={data.officeManagers}
				// addButtonText={"Add Office Manager"}
				// addButtonPath={allRoutes.ADD_OFFICE_MANAGER}
				// addButtonState={null}
				detailsPagePath={allRoutes.VIEW_OFFICE_MANAGER}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no office managers present. Please add an office manager"}
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default OfficeManagers;
