import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../../PageLayout/PageLayout";
import { allRoutes } from "../../../Routes/AllRoutes";
import { getAllInstallerCompanies } from "../../../Services/dashboardService";
import TableBlock from "../../Common/Table/TableBlock";

const tableHeaders = [
	{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
	{ text: "Name", key: "name", sortable: true, showEllipses: true, maxWidth: 130 },
	{ text: "Email address", key: "email", sortable: true },
];

const InstallerCompanies = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<Array<any>>([]);

	useEffect(() => {
		getAllUsers();
	}, []);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const { data } = await getAllInstallerCompanies();
			setData(data);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading="Installer Companies"
				subHeading="These are all the installer companies:"
				tableData={data}
				addButtonText="Add Installer Company"
				addButtonPath={allRoutes.ADD_INSTALLER_COMPANY}
				detailsPagePath={allRoutes.VIEW_INSTALLER_COMPANY}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no installer companies present. Please add an installer company"
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default InstallerCompanies;
