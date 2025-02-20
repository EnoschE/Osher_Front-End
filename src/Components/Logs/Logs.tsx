import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AddLogDialog from "./AddLogDialog";
import TableBlock from "../Common/Table/TableBlock";
import { getCustomerDetails, getLogsOfCustomer } from "../../Services/dashboardService";

export const tableHeaders = [
	{ text: "Timestamp", key: "timeStamp" },
	{ text: "Log", key: "log" },
];

const Logs = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [customer, setCustomer] = useState<any>(null);
	const [customerLogs, setCustomerLogs] = useState<Array<any>>([]);
	const [showDialog, setShowDialog] = useState<boolean>(false);

	useEffect(() => {
		getData();
	}, []);

	const getData = async (getOnlyLogs?: boolean) => {
		setLoading(!getOnlyLogs);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());
			setCustomer(userData);

			const { data: logs } = await getLogsOfCustomer((userData?._id || "")?.toString());
			setCustomerLogs(logs);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);

	return (
		<PageLayout loading={loading}>
			<Box mt={24} />
			<TableBlock
				heading={"Logs"}
				subHeading={`These are all the logs of ${customer?.name}:`}
				tableData={customerLogs}
				addButtonText="Add Comment"
				addButtonClick={openDialog}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no logs present."
				rowsPerPage={20}
			/>
			<AddLogDialog
				open={showDialog}
				onClose={closeDialog}
				onSuccess={() => getData(true)}
				customerId={customer?._id}
			/>
		</PageLayout>
	);
};

export default Logs;
