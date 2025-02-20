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
import {
	deleteInstallerById,
	getDetailsOfInstaller,
	getRepresentativesOfManager,
} from "../../../Services/dashboardService";
import PlaceholderForEmptyTable from "../../Common/Table/PlaceholderForEmptyTable";// import { isAdminLoggedIn, isOfficeManagerLoggedIn } from "../../../Services/userService";
import AssignRepresentativeDialog from "../AssignRepresentativeDialog";
import ProfileHeader from "../../Admins/ProfileHeader";
import { isDirectorLoggedIn, isSuperAdminLoggedIn } from "../../../Services/userService";
import CustomTableOptions from "../../Common/CustomTableOptions";

const ManagerDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [projects, setProjects] = useState<Array<any>>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [assigningCustomer, setAssigningCustomer] = useState<{ text: string; id: string; mongoId: string } | null>(
		null,
	);

	useEffect(() => {
		window.scrollTo(0, 0);
		getDetails();
	}, []);

	const getDetails = async (onlyGetProject?: boolean) => {
		if (!id) navigate(allRoutes.DASHBOARD);

		setLoading(!onlyGetProject);
		try {
			const { data } = await getDetailsOfInstaller((id ?? "")?.toString());
			const userData = data;
			setData(data);

			if (!data) {
				toast.error("Incorrect manager id");
				return navigate(allRoutes.DASHBOARD);
			}

			const { data: assignedCustomers } = await getRepresentativesOfManager((userData?._id ?? "")?.toString());
			setProjects(assignedCustomers || []);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDeleteDialog = () => setDeleteDialog(true);
	const closeDeleteDialog = () => setDeleteDialog(false);

	const handleEdit = () => {
		navigate(allRoutes.EDIT_MANAGER.replace(":id", (id ?? "")?.toString()));
	};

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteInstallerById(data._id ?? "");
			if (res === "Account deleted") {
				toast.success("Manager deleted successfully!");

				// if (isOfficeManagerLoggedIn()) {
				// 	navigate(allRoutes.DASHBOARD);
				// } else {
				navigate(allRoutes.MANAGERS);
				// navigate(allRoutes.VIEW_OFFICE_MANAGER.replace(":id", data?.officeManagerId));
				// }
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const openDialog = (props: { text: string; id: string; mongoId: string }) => setAssigningCustomer(props);
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
		{ text: "PSL", key: "pslName", errorMessage: "Not assigned" },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType="Manager"
				handleEdit={handleEdit}
				handleDelete={openDeleteDialog}
				disableDeleteButton={!!projects?.length}
				tooltipText="You cannot delete manager account that have representatives assigned to them"
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
				<Typography variant="h5">Assigned Representatives</Typography>

				<Box
					display="flex"
					alignItems={{ xs: "stretch", md: "center" }}
					justifyContent="space-between"
					flexDirection={{ xs: "column", md: "row" }}
					gap={12}
					mb={32}
				>
					<Typography fontSize={16}>These are all the representatives assigned to {data.name}:</Typography>
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
								onClick={() =>
									navigate(allRoutes.ADD_REPRESENTATIVE, {
										state: {
											managerId: data?._id,
											officeManagerId: data?.officeManagerId,
											companyId: data?.companyId,
											// managerId: data?.mongoId,
											// officeManagerId: data?.officeManagerId,
											// companyId: data?.companyMongoId,
										},
									})
								}
							>
								Add Representative
							</CustomButton>
						)}
					</Box>
				</Box>

				{projects?.length ? (
					<CustomTable headers={headers} rows={projects} detailsPagePath={allRoutes.VIEW_REPRESENTATIVE} />
				) : (
					<PlaceholderForEmptyTable
						message={`No representative is currently assigned to ${data?.name}. Please add a representative.`}
					/>
				)}
			</Box>

			<DeleteDialog
				open={deleteDialog}
				onClose={closeDeleteDialog}
				userType="Manager"
				user={data}
				onDelete={handleDelete}
			/>

			<AssignRepresentativeDialog
				open={!!assigningCustomer}
				activeUser={assigningCustomer}
				onClose={closeDialog}
				currentSelection={data}
				onSuccess={() => getDetails(true)}
				type="Manager"
			/>
		</PageLayout>
	);
};

export default ManagerDetails;
