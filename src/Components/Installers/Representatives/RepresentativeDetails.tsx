import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../PageLayout/PageLayout";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../../Routes/AllRoutes";
import DeleteDialog from "../../Common/DeleteDialog";
import CustomTable from "../../Common/Table/CustomTable";
import { toast } from "react-toastify";
import StatusChip from "../../Common/StatusChip";
import {
	deleteInstallerById,
	getCustomersOfRepresentative,
	getDetailsOfInstaller,
} from "../../../Services/dashboardService";
import CustomButton from "../../Common/CustomButton";
import { Add, DownloadOutlined } from "@mui/icons-material";
import PlaceholderForEmptyTable from "../../Common/Table/PlaceholderForEmptyTable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AssignRepresentativeDialog from "../AssignRepresentativeDialog";
import AssignCustomerDialog from "../AssignCustomerDialog";
import ProfileHeader from "../../Admins/ProfileHeader";
import { isDirectorLoggedIn, isSuperAdminLoggedIn } from "../../../Services/userService";
import CustomTableOptions from "../../Common/CustomTableOptions";

export const customerTableHeaders = [
	{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 40 },
	{ text: "Name", key: "name", showEllipses: true, maxWidth: 100, sortable: true },
	{ text: "Email address", key: "email", showEllipses: true, maxWidth: 130, sortable: true },
	{
		text: "Phone number",
		key: "phone_no",
		alternateKey: "phone",
		customComponent: (props: { text: string; fullObject: any }) => (
			<Typography component="span" width="max-content">
				{props.text || "-"}
			</Typography>
		),
	},
	// { text: "Email Status", key: "isEmailVerified" , customComponent : (props:any)=>(props.fullObject.isEmailVerified ? "Verified" :  "Not Verified") },

	{
		text: "Current Step",
		key: "currentStep",
		customComponent: (props: { text: string; fullObject: any }) => (
			<Box>
				<Typography variant="inherit" color="primary" fontWeight={600} mb={5}>
					{props.text}
				</Typography>
				<StatusChip status={props.fullObject.status} />
			</Box>
		),
		sortable: true,
	},

	// {
	// 	text: "Status",
	// 	key: "status",
	// 	customComponent: (props: { text: string }) => <StatusChip status={props.text} />,
	// },
	{
		text: "Report",
		key: "status",
		align: "center",
		customComponent: (props: { fullObject: any }) => {
			const notReportsPresent = !props.fullObject?.summaryProposalPdfLink && !props.fullObject?.billAnalysisPdfLink;
			return (
				<Tooltip
					title={notReportsPresent ? "Reports have not been generated for this customer" : "Download Reports"}
					placement="top"
					arrow
				>
					<span>
						<IconButton
							color="primary"
							disabled={notReportsPresent}
							onClick={() =>
								downloadPDFFiles([props.fullObject?.summaryProposalPdfLink, props.fullObject?.billAnalysisPdfLink])
							}
						>
							<DownloadOutlined />
						</IconButton>
					</span>
				</Tooltip>
			);
		},
	},
];

export const downloadPDFFiles = async (urls: any) => {
	const zip = new JSZip();
	urls = urls.filter(Boolean);
	console.log("URLS", urls);

	for (const url of urls) {
		const response = await fetch(url);
		const blob = await response.blob();
		zip.file(url.split("/").pop(), blob);
	}
	zip.generateAsync({ type: "blob" }).then((content: any) => {
		saveAs(content, "reports.zip");
	});
};

const RepresentativeDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [projects, setProjects] = useState<Array<any>>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [assigningCustomer, setAssigningCustomer] = useState<{ text: string; id: string } | null>(null);
	const [dialogForNewCustomer, setDialogForNewCustomer] = useState<boolean>(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		getDetails();
	}, []);

	const getDetails = async (onlyGetProject?: boolean) => {
		if (!id) navigate(allRoutes.DASHBOARD);

		setLoading(!onlyGetProject);
		try {
			const { data: userData } = await getDetailsOfInstaller((id ?? "")?.toString());
			setData(userData);

			const { data: assignedCustomers } = await getCustomersOfRepresentative((userData?._id ?? "")?.toString());
			setProjects(assignedCustomers || []);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDeleteDialog = () => setDeleteDialog(true);
	const closeDeleteDialog = () => setDeleteDialog(false);

	const openAssigningDialog = () => setDialogForNewCustomer(true);
	const closeAssigningDialog = () => setDialogForNewCustomer(false);

	const handleEdit = () => {
		navigate(allRoutes.EDIT_REPRESENTATIVE.replace(":id", (id ?? "")?.toString()));
	};

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteInstallerById(data._id ?? "");
			if (res === "Account deleted") {
				toast.success("Representative deleted successfully!");
				navigate(allRoutes.REPRESENTATIVES);
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const openDialog = (props: { text: string; id: string }) => setAssigningCustomer(props);
	const closeDialog = () => setAssigningCustomer(null);

	const headers = [
		...customerTableHeaders.filter((item) => item.text !== "Report"),
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
								text: "Reassign",
								onClick: () => openDialog(props),
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

	const fields = [
		{ text: "Name", key: "name" },
		{ text: "Email address", key: "email" },
		{ text: "Address", key: "address" },
		{ text: "Phone Number", key: "phone_no" },
		{ text: "Installer Company", key: "company", showEllipses: true, maxWidth: 130, sortable: true },
		{ text: "PSL", key: "pslName", errorMessage: "Not assigned" },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType="Representative"
				handleEdit={handleEdit}
				handleDelete={openDeleteDialog}
				disableDeleteButton={!!projects?.length}
				tooltipText="You cannot delete representative account that have customer assigned to them"
			/>

			<Box
				display="grid"
				gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
				gap={{ xs: 10, md: 32 }}
				alignItems="center"
				mt={45}
			>
				{fields?.map((field) => (
					<React.Fragment key={field.key}>
						<Typography variant="h6">{field.text}</Typography>
						<Typography>{data?.[field.key] || field.errorMessage || "Not given"}</Typography>
					</React.Fragment>
				))}
			</Box>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />
			<Box>
				<Typography variant="h5">Assigned Customers</Typography>
				<Box
					display="flex"
					alignItems={{ xs: "stretch", md: "center" }}
					justifyContent="space-between"
					flexDirection={{ xs: "column", md: "row" }}
					gap={12}
					mb={32}
				>
					<Typography fontSize={16} mt={10}>
						These are all the customers assigned to {data.name}
					</Typography>
					<Box
						display="flex"
						alignItems={{ xs: "stretch", md: "center" }}
						justifyContent="flex-end"
						gap={12}
						flexDirection={{ xs: "column", md: "row" }}
					>
						{(isSuperAdminLoggedIn() || isDirectorLoggedIn()) && (
							<CustomButton
								sx={{ height: 40.13, minWidth: "max-content" }}
								startIcon={<Add />}
								onClick={openAssigningDialog}
							>
								Assign Customer
							</CustomButton>
						)}
					</Box>
				</Box>

				{projects?.length ? (
					<CustomTable headers={headers} rows={projects} detailsPagePath={allRoutes.VIEW_CUSTOMER} />
				) : (
					<PlaceholderForEmptyTable
						message={`No customer is currently assigned to ${data?.name}. Please assign a customer.`}
					/>
				)}
			</Box>

			<DeleteDialog
				open={deleteDialog}
				onClose={closeDeleteDialog}
				userType="Representative"
				user={data}
				onDelete={handleDelete}
			/>

			<AssignRepresentativeDialog
				open={!!assigningCustomer}
				activeUser={assigningCustomer}
				onClose={closeDialog}
				currentSelection={data}
				onSuccess={() => getDetails(true)}
			/>

			<AssignCustomerDialog
				open={dialogForNewCustomer}
				onClose={closeAssigningDialog}
				onSuccess={() => getDetails(true)}
				// currentSelection={data}
				representative={data}
			/>
		</PageLayout>
	);
};

export default RepresentativeDetails;
