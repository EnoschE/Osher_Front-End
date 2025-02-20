import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allRoutes } from "../../../Routes/AllRoutes";
import PageLayout from "../../PageLayout/PageLayout";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import TableBlock from "../../Common/Table/TableBlock";
import { getAllInstallerAdmins } from "../../../Services/dashboardService";
import CustomTableOptions from "../../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";

const InstallerAdmins = () => {
	const navigate = useNavigate();
	const user = useSelector(selectUser);

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{
		admins?: Array<any>;
		managers?: Array<any>;
		officeManagers?: Array<any>;
		customers?: Array<any>;
		representatives?: Array<any>;
	}>({
		admins: [],
		officeManagers: [],
		managers: [],
		customers: [],
		representatives: [],
	});

	useEffect(() => {
		getAllUsers();
	}, [user]);

	const getAllUsers = async () => {
		if (!user.id) return;

		setLoading(true);
		try {
			let { data: allAdmins } = await getAllInstallerAdmins();

			if (allAdmins) allAdmins = allAdmins.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));

			setData({ admins: allAdmins });
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
							onClick: () => navigate(allRoutes.VIEW_INSTALLER_ADMIN_DASHBOARD.replace(":id", props.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading="Installer Admins"
				subHeading="These are all the installer admins in this company:"
				tableData={data.admins}
				addButtonText="Add Installer Admin"
				addButtonPath={allRoutes.ADD_INSTALLER_ADMIN}
				detailsPagePath={allRoutes.VIEW_INSTALLER_ADMIN}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no installer admins present. Please add an installer admin"
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default InstallerAdmins;
