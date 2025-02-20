import { customerTableHeaders, downloadPDFFiles } from "../Installers/Representatives/RepresentativeDetails";
import CustomDialog from "../Common/CustomDialog";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { Typography } from "@mui/material";
import StatusChip from "../Common/StatusChip";
import { steps } from "../../Utils/enums";
import TableBlock from "../Common/Table/TableBlock";

interface DialogProps {
	open: boolean;
	onClose?: () => void;
	onSuccess?: () => void;
	customers?: null | any[];
	selectedStep?: string | null;
}

const FunnelCustomerDialog = ({ open, onClose, customers, selectedStep }: DialogProps) => {
	const navigate = useNavigate();
	const isLeads = selectedStep === steps.LEAD;
	const isAcceptedProposal = selectedStep === steps.ACCEPTED_PROPOSAL;
	const isContractSigned = selectedStep === steps.CONTRACT_SIGNED;
	selectedStep = selectedStep === steps.PERMIT_APPLICATION ? "Permit and Interconnection" : selectedStep;

	const assignedCustomersTableHeaders = [
		...customerTableHeaders.filter((item) => !["currentStep", "status"].includes(item.key)),
		...(!(isLeads || isAcceptedProposal || isContractSigned)
			? [
					{
						text: "Current Step",
						key: "step",
						customComponent: (props: { text: string }) => (
							<Typography variant="inherit" color="primary" fontWeight={600}>
								{props.text}
							</Typography>
						),
						sortable: true,
					},
					{
						text: "Status",
						key: "status",
						customComponent: (props: { text: string }) => <StatusChip status={props.text} />,
						sortable: true,
					},
			  ]
			: []),
		{
			text: "",
			key: "name",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => {
				const notReportsPresent = !props.fullObject?.summaryProposalPdfLink && !props.fullObject?.billAnalysisPdfLink;
				return (
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
							{
								text: "Download Report",
								onClick: () => {
									if (!notReportsPresent) {
										downloadPDFFiles([props.fullObject?.summaryProposalPdfLink, props.fullObject?.billAnalysisPdfLink]);
									}
								},
								disabled: notReportsPresent,
								tooltip: notReportsPresent ? "Reports have not been generated for this customer" : "Download Reports",
							},
						]}
					/>
				);
			},
		},
	];

	return (
		<CustomDialog open={open} onClose={onClose} maxWidth={1000}>
			{customers && (
				<div>
					<TableBlock
						heading={`${selectedStep}s` as string}
						subHeading={`These are the customers in the ${selectedStep} funnel`}
						tableData={customers}
						tableHeaders={assignedCustomersTableHeaders}
						emptyStateMessage={`These are no customers in the ${selectedStep} funnel`}
						detailsPagePath={allRoutes.VIEW_CUSTOMER}
					/>
				</div>
			)}
		</CustomDialog>
	);
};

export default FunnelCustomerDialog;
