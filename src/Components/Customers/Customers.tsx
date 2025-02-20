import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getAllAssignedCustomers, getAllUnassignedCustomers } from "../../Services/dashboardService";
import TableBlock from "../Common/Table/TableBlock";
import { customerTableHeaders } from "../Installers/Representatives/RepresentativeDetails";
import { useNavigate } from "react-router-dom";
import AssignCompanyDialog from "../Installers/AssignCompanyDialog";
import {
	isAdminManagerLoggedIn,
	isDirectorLoggedIn,
	isPslLoggedIn,
	isSuperAdminLoggedIn,
} from "../../Services/userService";
import CustomTableOptions from "../Common/CustomTableOptions";

const Customers = () => {
	const navigate = useNavigate();
	const isPsl = isPslLoggedIn();
	const isAdminManager = isAdminManagerLoggedIn();
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{ assigned: Array<any>; unassigned: Array<any> }>({
		assigned: [],
		unassigned: [],
	});
	const [assigningCustomer, setAssigningCustomer] = useState<{ text: string; id: string } | null>(null);

	useEffect(() => {
		getAllUsers(true);
	}, []);

	const getAllUsers = async (displayLoader: boolean) => {
		setLoading(displayLoader);
		try {
			// const { data: assigned } = await getCustomersWithCurrentSteps();
			const { data: assigned } = await getAllAssignedCustomers();
			console.log("Assigned: ", assigned);

			const { data: unassigned } = await getAllUnassignedCustomers();
			console.log("Assigned: ", unassigned);

			setData({ assigned: assigned || [], unassigned: unassigned || [] });
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDialog = (props: { text: string; id: string }) => setAssigningCustomer(props);
	const closeDialog = () => setAssigningCustomer(null);

	const unassignedCustomersTableHeader = [
		...customerTableHeaders.filter((item) => item.text !== "Report"),
		{
			text: "",
			key: "name",
			align: "right",
			notClickable: true,
			customComponent: (props: { id: string; text: string }) => (
				<CustomTableOptions
					menuOptions={[
						{
							text: "Assign Installer Company",
							onClick: () => {
								openDialog(props);
							},
						},
					]}
				/>
			),
		},
	];

	const assignedCustomersTableHeader = [
		...customerTableHeaders.slice(0, 4),
		{ text: "Installer Company", key: "company", sortable: true, showEllipses: true, maxWidth: 130 },
		...customerTableHeaders.slice(4).filter((item) => item.text !== "Report"),
		{
			text: "",
			key: "name",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => (
				<CustomTableOptions
					menuOptions={[
						{
							text: "View Logs",
							onClick: () => {
								navigate(allRoutes.LOGS.replace(":id", props.sequentialId));
							},
						},

						{
							text: "Change Status",
							onClick: () => {
								navigate(allRoutes.UPDATE_STATUS.replace(":id", props.sequentialId));
							},
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				addButtonText={isSuperAdminLoggedIn() || isDirectorLoggedIn() ? "Add Customer" : undefined}
				addButtonPath={isSuperAdminLoggedIn() || isDirectorLoggedIn() ? allRoutes.ADD_CUSTOMER : undefined}
				heading="Unassigned Customers"
				subHeading="These are all the unassigned customers:"
				tableData={data.unassigned}
				tableHeaders={unassignedCustomersTableHeader}
				emptyStateMessage="There are no unassigned customers available"
				detailsPagePath={allRoutes.VIEW_CUSTOMER}
			/>

			<Divider sx={{ my: 16 }} />

			<TableBlock
				heading="Customers"
				subHeading="These are all the customers with assigned company:"
				tableData={data.assigned}
				tableHeaders={assignedCustomersTableHeader}
				emptyStateMessage="There are no customers present. Please add a customer"
				filterByCompany={!(isPsl || isAdminManager)}
				detailsPagePath={allRoutes.VIEW_CUSTOMER}
			/>

			<AssignCompanyDialog
				open={!!assigningCustomer}
				activeUser={assigningCustomer}
				onClose={closeDialog}
				onSuccess={() => getAllUsers(false)}
			/>
		</PageLayout>
	);
};

export default Customers;
