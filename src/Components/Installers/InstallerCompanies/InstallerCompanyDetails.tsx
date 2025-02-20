import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../PageLayout/PageLayout";
import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../../Routes/AllRoutes";
import DeleteDialog from "../../Customers/DeleteDialog";
import ProfileHeader from "../../Admins/ProfileHeader";
import {
	deleteCustomer,
	getAllAssignedCustomersByCompanyId,
	getAllInstallerAdminsByCompanyId,
	getAllManagersByCompanyId,
	getAllOfficeManagersByCompanyId,
	getAllRepresentativesByCompanyId,
	getAllTechniciansByCompanyId,
	getAllUnassignedCustomersByCompanyId,
	getInstallerCompanyDetails,
} from "../../../Services/dashboardService";
import { toast } from "react-toastify";
import TableBlock from "../../Common/Table/TableBlock";
import { customerTableHeaders, downloadPDFFiles } from "../Representatives/RepresentativeDetails";
import AssignRepresentativeDialog from "../AssignRepresentativeDialog";
import CustomTableOptions from "../../Common/CustomTableOptions";
import RenderZipCodes from "../../UtilityCompanies/RenderZipCodes";
import { isSuperAdminLoggedIn } from "../../../Services/userService";

const tableHeaders = [
	{ text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
	{ text: "Name", key: "name", showEllipses: true, maxWidth: 100, sortable: true },
	{ text: "Email address", key: "email", showEllipses: true, maxWidth: 130, sortable: true },
];

const InstallerCompanyDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [projects, setProjects] = useState<any>({
		admins: [],
		officeManagers: [],
		managers: [],
		representatives: [],
		technicians: [],
		assignedCustomers: [],
		unassignedCustomers: [],
	});
	const [assigningCustomer, setAssigningCustomer] = useState<{ text: string; id: string } | null>(null);
	const [zipCodes, setZipCodes] = useState<string[]>([]);

	useEffect(() => {
		getDetails(true);
	}, []);

	const getDetails = async (displayLoader: boolean) => {
		if (!id) navigate(allRoutes.INSTALLER_COMPANIES);

		setLoading(displayLoader);
		try {
			const { data: companyData } = await getInstallerCompanyDetails((id ?? "")?.toString());
			setData(companyData);
			setZipCodes(companyData?.zipCodes || []);

			const [
				{ data: officeManagers },
				{ data: managers },
				{ data: admins },
				{ data: representatives },
				{ data: technicians },
				{ data: assigned },
				{ data: unassigned },
			] = await Promise.all([
				getAllOfficeManagersByCompanyId((companyData?._id ?? "")?.toString()),
				getAllManagersByCompanyId((companyData?._id ?? "")?.toString()),
				getAllInstallerAdminsByCompanyId((companyData?._id ?? "")?.toString()),
				getAllRepresentativesByCompanyId((companyData?._id ?? "")?.toString()),
				getAllTechniciansByCompanyId((companyData?._id ?? "")?.toString()),
				getAllAssignedCustomersByCompanyId((companyData?._id ?? "")?.toString()),
				getAllUnassignedCustomersByCompanyId((companyData?._id ?? "")?.toString()),
			]);

			setProjects({
				officeManagers: officeManagers || [],
				representatives: representatives || [],
				technicians: technicians || [],
				managers: managers || [],
				admins: admins || [],
				assignedCustomers: assigned || [],
				unassignedCustomers: unassigned || [],
			});
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDialog = () => setOpenDeleteDialog(true);
	const closeDialog = () => setOpenDeleteDialog(false);

	const handleEdit = () => navigate(allRoutes.EDIT_INSTALLER_COMPANY.replace(":id", (id || "")?.toString()));

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteCustomer(data?._id || "");
			if (res === "Account deleted") {
				toast.success("Installer deleted successfully!");
				navigate(allRoutes.INSTALLER_COMPANIES);
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const openAssignDialog = (props: { text: string; id: string }) => setAssigningCustomer(props);
	const closeAssignDialog = () => setAssigningCustomer(null);

	const techniciansTableHeaders = [
		...tableHeaders,
		{ text: "Email Status", key: "isEmailVerified" },
		{ text: "Calender Synced", key: "calendarSynced" },
		{
			text: "",
			key: "name",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => {
				return (
					<CustomTableOptions
						menuOptions={[
							{
								text: "View Calendar",
								onClick: () => {
									navigate(allRoutes.CALENDAR_TECHNICIAN.replace(":id", props.fullObject.sequentialId));
								},
							},
						]}
					/>
				);
			},
		},
	];

	const assignedCustomersTableHeaders = [
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

	const unassignedCustomersTableHeader = [
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
								text: "Assign Representative",
								onClick: () => openAssignDialog(props),
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
		{ text: "Phone Number", key: "phone" },
		{ text: "Zip Codes", key: "zipCodes" },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType="Installer Company"
				handleEdit={handleEdit}
				handleDelete={openDialog}
				disableDeleteButton
				tooltipText="Installer company cannot be deleted at this moment" // TODO: fix it later
				// disableDeleteButton={!!projects?.length}
			/>

			<Box
				display="grid"
				gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
				gap={{ xs: 10, md: 32 }}
				alignItems="center"
				mt={45}
			>
				{fields?.map((field) =>
					field.key === "zipCodes" ? (
						<RenderZipCodes key={field.key} values={zipCodes} />
					) : (
						<React.Fragment key={field.key}>
							<Typography variant="h6">{field.text}</Typography>
							<Typography>{data?.[field.key] || "Not given"}</Typography>
						</React.Fragment>
					),
				)}
			</Box>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading="Installer Admins"
				subHeading="These are all the installer admins in this company:"
				tableData={projects.admins}
				addButtonText="Add Installer Admin"
				addButtonPath={allRoutes.ADD_INSTALLER_ADMIN + `?companyId=${id}`}
				detailsPagePath={allRoutes.VIEW_INSTALLER_ADMIN}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no installer admins present. Please add an installer admin"
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading={"Office Managers"}
				subHeading={`These are all the office managers in this company:`}
				tableData={projects.officeManagers}
				addButtonText={"Add Office Manager"}
				addButtonPath={allRoutes.ADD_OFFICE_MANAGER + `?companyId=${id}`}
				addButtonState={null}
				detailsPagePath={allRoutes.VIEW_OFFICE_MANAGER}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no office managers present. Please add an office manager"}
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading={"Managers"}
				subHeading={`These are all the managers in this company:`}
				tableData={projects.managers}
				detailsPagePath={allRoutes.VIEW_MANAGER}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no managers present. Please add a manager"}
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading={"Representatives"}
				subHeading={`These are all the representatives in this company:`}
				tableData={projects.representatives}
				detailsPagePath={allRoutes.VIEW_REPRESENTATIVE}
				tableHeaders={tableHeaders}
				emptyStateMessage={"There are no representatives present. Please add a representative"}
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				addButtonText={isSuperAdminLoggedIn() ? "Add Installation Crew" : ""}
				addButtonPath={isSuperAdminLoggedIn() ? allRoutes.ADD_TECHNICIAN + `?companyId=${id}` : ""}
				heading={"Installation Crew"}
				subHeading={`These are all the installation crew in this company:`}
				tableData={projects.technicians}
				detailsPagePath={allRoutes.VIEW_TECHNICIAN}
				tableHeaders={techniciansTableHeaders}
				emptyStateMessage={"There are no installation crew present. Please add an installation crew"}
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading={"Assigned Customers"}
				subHeading={`These are all the assigned customers of ${data.name}:`}
				tableData={projects.assignedCustomers}
				tableHeaders={assignedCustomersTableHeaders}
				emptyStateMessage={"There are no assigned customers"}
				detailsPagePath={allRoutes.VIEW_CUSTOMER}
			/>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />

			<TableBlock
				rowsPerPage={10}
				heading="Unassigned Customers"
				subHeading={`These are all the unassigned customers of ${data.name}:`}
				tableData={projects.unassignedCustomers}
				tableHeaders={unassignedCustomersTableHeader}
				emptyStateMessage="There are no unassigned customers available"
				detailsPagePath={allRoutes.VIEW_CUSTOMER}
			/>

			<DeleteDialog
				open={openDeleteDialog}
				onClose={closeDialog}
				userType="Installer"
				user={data}
				onDelete={handleDelete}
			/>

			<AssignRepresentativeDialog
				open={!!assigningCustomer}
				activeUser={assigningCustomer}
				onClose={closeAssignDialog}
				onSuccess={() => getDetails(false)}
				companyId={data._id} // TEST THIS
			/>
		</PageLayout>
	);
};

export default InstallerCompanyDetails;
