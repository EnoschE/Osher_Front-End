import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../PageLayout/PageLayout";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../../Routes/AllRoutes";
import { toast } from "react-toastify";
import DeleteDialog from "../../Common/DeleteDialog";
import ProfileHeader from "../../Admins/ProfileHeader";
import { getDetailsOfInstaller, deleteInstallerById } from "../../../Services/dashboardService";
import { roles } from "../../../Utils/tokenKeyValue";

const InstallerAdminDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	// const [projects, setProjects] = useState<Array<any>>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		getDetails();
	}, []);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.DASHBOARD);

		setLoading(true);
		try {
			const { data: userData } = await getDetailsOfInstaller((id ?? "")?.toString());
			setData(userData);

			// const { data: assignedCustomers } = await getManagersOfOfficeManager((id || "")?.toString());
			// setProjects(assignedCustomers || []);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDialog = () => setOpenDeleteDialog(true);
	const closeDialog = () => setOpenDeleteDialog(false);

	const handleEdit = () => {
		navigate(allRoutes.EDIT_INSTALLER_ADMIN.replace(":id", (id || "")?.toString()));
	};

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteInstallerById(data._id || "");
			if (res === "Account deleted") {
				toast.success("Installer admin deleted successfully!");
				navigate(allRoutes.INSTALLER_ADMINS);
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const fields = [
		{ text: "Name", key: "name" },
		{ text: "Email address", key: "email" },
		{ text: "Address", key: "address" },
		{ text: "Phone Number", key: "phone_no" },
		{ text: "Company Name", key: "company" },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType="Installer Admin"
				handleEdit={handleEdit}
				handleDelete={openDialog}
				// disableDeleteButton={!!projects?.length}
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

			<DeleteDialog
				open={openDeleteDialog}
				onClose={closeDialog}
				userType="Office Manager"
				user={data}
				onDelete={handleDelete}
			/>
		</PageLayout>
	);
};

export default InstallerAdminDetails;
