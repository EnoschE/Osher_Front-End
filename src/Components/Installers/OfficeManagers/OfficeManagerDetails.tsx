import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../PageLayout/PageLayout";
import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../../Routes/AllRoutes";
import DeleteDialog from "../../Common/DeleteDialog";
import CustomTable, { tableHeaders } from "../../Common/Table/CustomTable";
import { toast } from "react-toastify";
import CustomButton from "../../Common/CustomButton";
import { Add } from "@mui/icons-material";
import PlaceholderForEmptyTable from "../../Common/Table/PlaceholderForEmptyTable";
import ProfileHeader from "../../Admins/ProfileHeader";
import AssignRepresentativeDialog from "../AssignRepresentativeDialog";
import {
	getDetailsOfInstaller,
	deleteInstallerById,
	getManagersOfOfficeManager,
} from "../../../Services/dashboardService";
import CustomTableOptions from "../../Common/CustomTableOptions";

const OfficeManagerDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [projects, setProjects] = useState<Array<any>>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [assigningCustomer, setAssigningCustomer] = useState<{ text: string; id: string } | null>(null);

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

			const { data: assignedCustomers } = await getManagersOfOfficeManager((userData?._id ?? "")?.toString());
			setProjects(assignedCustomers || []);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDeletingDialog = () => setDeleteDialog(true);
	const closeDeleteDialog = () => setDeleteDialog(false);

	const handleEdit = () => {
		navigate(allRoutes.EDIT_OFFICE_MANAGER.replace(":id", (id ?? "")?.toString()));
	};

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteInstallerById(data._id ?? "");
			if (res === "Account deleted") {
				toast.success("Office Manager deleted successfully!");
				navigate(allRoutes.OFFICE_MANAGERS);
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const openDialog = (props: { text: string; id: string }) => setAssigningCustomer(props);
	const closeDialog = () => setAssigningCustomer(null);

	const headers = [
		...tableHeaders,
		{
			text: "",
			key: "name",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => (
				<CustomTableOptions
					menuOptions={[
						{
							text: "Reassign",
							onClick: () => openDialog(props),
						},
					]}
				/>
			),
		},
	];

	const fields = [
		{ text: "Name", key: "name" },
		{ text: "Email address", key: "email" },
		{ text: "Address", key: "address" },
		{ text: "Phone Number", key: "phone_no" },
		{ text: "Installer Company", key: "company", showEllipses: true, maxWidth: 130, sortable: true },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType="Office Manager"
				handleEdit={handleEdit}
				handleDelete={openDeletingDialog}
				disableDeleteButton={!!projects?.length}
				tooltipText="You cannot delete office manager account that have managers assigned to them"
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
						<Typography>{data?.[field.key] || "Not given"}</Typography>
					</React.Fragment>
				))}
			</Box>

			<Divider sx={{ my: { xs: 16, md: 42 } }} />
			<Box>
				<Typography variant="h5">Assigned Managers</Typography>

				<Box
					display="flex"
					alignItems={{ xs: "stretch", md: "center" }}
					justifyContent="space-between"
					flexDirection={{ xs: "column", md: "row" }}
					gap={12}
					mb={32}
				>
					<Typography fontSize={16}>These are all the managers assigned to {data.name}:</Typography>
					<Box
						display="flex"
						alignItems={{ xs: "stretch", md: "center" }}
						justifyContent="flex-end"
						gap={12}
						flexDirection={{ xs: "column", md: "row" }}
					>
						<CustomButton
							sx={{ height: 40.13, minWidth: "max-content" }}
							startIcon={<Add />}
							onClick={
								() =>
									navigate(allRoutes.ADD_MANAGER, {
										state: { officeManagerId: data._id, companyId: data.companyId },
									})
								// navigate(allRoutes.ADD_MANAGER, { state: { officeManagerId: id, companyId: data.companyId } })
							}
						>
							Add Manager
						</CustomButton>
					</Box>
				</Box>

				{projects?.length ? (
					<CustomTable headers={headers} rows={projects} detailsPagePath={allRoutes.VIEW_MANAGER} />
				) : (
					<PlaceholderForEmptyTable
						message={`No manager is currently assigned to ${data?.name}. Please add a manager.`}
					/>
				)}
			</Box>

			<DeleteDialog
				open={deleteDialog}
				onClose={closeDeleteDialog}
				userType="Office Manager"
				user={data}
				onDelete={handleDelete}
			/>

			<AssignRepresentativeDialog
				open={!!assigningCustomer}
				activeUser={assigningCustomer}
				onClose={closeDialog}
				currentSelection={data}
				onSuccess={() => getDetails(true)}
				type="Office Manager"
			/>
		</PageLayout>
	);
};

export default OfficeManagerDetails;
