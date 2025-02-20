import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getAllTechnicians } from "../../Services/dashboardService";
import TableBlock from "../Common/Table/TableBlock";
import { useNavigate } from "react-router-dom";
import CustomTableOptions from "../Common/CustomTableOptions";


const Technicians = () => {
	const navigate =   useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<Array<any>>([]);


	const tableHeaders = [
		{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
		{ text: "Name", key: "name", showEllipses: true, maxWidth: 100, sortable: true },
		{ text: "Email address", key: "email", showEllipses: true, maxWidth: 130, sortable: true },
		{ text: "Company", key: "company", showEllipses: true, maxWidth: 130 },
		{ text: "Email Status", key: "isEmailVerified" },
		{ text: "Calender Synced", key: "calendarSynced" },
	
	];
	
	useEffect(() => {
		getAllUsers();
	}, []);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const { data } = await getAllTechnicians();
			setData(data);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading="Installation Crew"
				subHeading="These are all the installation crew:"
				tableData={data}
				addButtonText="Add Installation Crew"
				addButtonPath={allRoutes.ADD_TECHNICIAN}
				detailsPagePath={allRoutes.VIEW_TECHNICIAN}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no installation crew present. Please add a installation crew"
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default Technicians;
