import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getAllAdmins } from "../../Services/dashboardService";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";

const Admins = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<Array<any>>([]);

	useEffect(() => {
		getAllUsers();
	}, []);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const { data } = await getAllAdmins();
			setData(data);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const tableHeaders = [
		{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
		{ text: "Name", key: "name", sortable: true },
		{ text: "Email address", key: "email", sortable: true },
		{ text: "Role", key: "role", sortable: true },
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
							onClick: () => navigate(allRoutes.VIEW_ADMIN_DASHBOARD.replace(":id", props.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading="Employees"
				subHeading="These are all the employees (Super admins, directors, admin managers and PSL):"
				tableData={data}
				addButtonText="Add Employee"
				addButtonPath={allRoutes.ADD_ADMIN}
				detailsPagePath={allRoutes.VIEW_ADMIN}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no employees present. Please add an employee"
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default Admins;
