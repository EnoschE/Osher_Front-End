import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "./ProfileHeader";
import {
	deleteCustomer,
	getAllManagersForPSL,
	getAllPSLsForAdminManager,
	getAllRepresentativesForPSL,
	getCustomerDetails,
	getInstallerManagersOfPSL,
	getPSLsOfAdminManager,
	getRepresentativesOfPSL,
} from "../../Services/dashboardService";
import { toast } from "react-toastify";
import { roles } from "../../Utils/tokenKeyValue";
import TableBlock from "../Common/Table/TableBlock";
import { tableHeaders } from "../Common/Table/CustomTable";
import AssignPSLDialog from "./AssignPSLDialog";
import UnassignPSLDialog from "./UnassignPSLDialog";
import CustomTableOptions from "../Common/CustomTableOptions";

const AdminDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<any>({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [assignDialog, setAssignDialog] = useState<any>("");
	const [unassignDialog, setUnassignDialog] = useState<any>({ id: "", name: "", type: "" });
	const [allUsers, setAllUsers] = useState<{
		psl: Array<any>;
		managers: Array<any>;
		representatives: Array<any>;
	}>({
		psl: [],
		managers: [],
		representatives: [],
	});
	const [projects, setProjects] = useState<{
		psl: Array<any>;
		managers: Array<any>;
		representatives: Array<any>;
	}>({
		psl: [],
		managers: [],
		representatives: [],
	});

	useEffect(() => {
		getDetails(true);
	}, [id]);

	const getDetails = async (displayLoader: boolean) => {
		if (!id) navigate(allRoutes.ADMINS);
		window.scrollTo(0, 0);

		setLoading(displayLoader);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());
			setData(userData);

			if (userData.role === roles.ADMIN_MANGER) {
				const [{ data: psl }, { data: allPsl }] = await Promise.all([
					// getPSLsOfAdminManager((id || "").toString()),
					getPSLsOfAdminManager((userData?._id || "").toString()),
					getAllPSLsForAdminManager(),
				]);

				setProjects({ psl: psl || [], managers: [], representatives: [] });
				setAllUsers({ psl: allPsl || [], managers: [], representatives: [] });
			} else if (userData.role === roles.PSL) {
				let [{ data: managers }, { data: representatives }, { data: allManagers }, { data: allRepresentatives }] =
					await Promise.all([
						// getInstallerManagersOfPSL((id || "").toString()),
						getInstallerManagersOfPSL((userData?._id || "").toString()),
						// getRepresentativesOfPSL((id || "").toString()),
						getRepresentativesOfPSL((userData?._id || "").toString()),
						getAllManagersForPSL(),
						getAllRepresentativesForPSL(),
					]);

				if (managers?.length)
					managers = managers.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));
				if (representatives?.length)
					representatives = representatives.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));
				if (allManagers?.length)
					allManagers = allManagers.map((item: any) => ({ ...item, company: item.companyId?.name || "" }));
				if (allRepresentatives?.length)
					allRepresentatives = allRepresentatives.map((item: any) => ({
						...item,
						company: item.companyId?.name || "",
					}));

				setProjects({
					psl: [],
					managers: managers || [],
					representatives: representatives || [],
				});
				setAllUsers({
					psl: [],
					managers: allManagers || [],
					representatives: allRepresentatives || [],
				});
			}
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const openDialog = () => setOpenDeleteDialog(true);
	const closeDialog = () => setOpenDeleteDialog(false);

	const openAssignDialog = (type: string) => setAssignDialog(type);
	const closeAssignDialog = () => setAssignDialog("");

	const openUnassignDialog = (props: { type: string; id: string; name: string }) => setUnassignDialog(props);
	const closeUnassignDialog = () => setUnassignDialog({ type: "", id: "", name: "" });

	const handleEdit = () => navigate(allRoutes.EDIT_ADMIN.replace(":id", (id || "")?.toString()));

	const handleDelete = async () => {
		try {
			const { data: res } = await deleteCustomer(data?._id || "");
			if (res === "Account deleted") {
				toast.success("Admin deleted successfully!");
				navigate(allRoutes.ADMINS);
			}
		} catch (error: any) {
			toast.error(error);
		}
	};

	const projectsHeaders = (type: string) => {
		const forPSL = type === "PSL";
		return [
			...tableHeaders,
			...(forPSL
				? []
				: [{ text: "Installer Company", key: "company", showEllipses: true, maxWidth: 130, sortable: true }]),
			{
				text: "",
				key: "name",
				align: "right",
				notClickable: true,
				customComponent: (props: any) => (
					<CustomTableOptions
						menuOptions={[
							{ text: "Reassign", onClick: () => openUnassignDialog({ id: props.id, type, name: props.text }) },
						]}
					/>
				),
			},
		];
	};

	const fields = [
		{ text: "Name", key: "name" },
		{ text: "Email address", key: "email" },
		{ text: "Address", key: "address" },
		{ text: "Phone Number", key: "phone" },
	];

	return (
		<PageLayout loading={loading}>
			<ProfileHeader
				data={data}
				userType={
					data?.role === roles.SUPER_ADMIN
						? "Super Admin"
						: data?.role === roles.DIRECTOR
						? "Director"
						: data?.role === roles.PSL
						? "PSL"
						: "Admin Manager"
				}
				handleEdit={handleEdit}
				handleDelete={openDialog}
				disableDeleteButton={
					data?.role === roles.ADMIN_MANGER
						? !!projects.psl?.length
						: !!projects.managers?.length || !!projects.representatives?.length
				}
				tooltipText={
					data?.role === roles.ADMIN_MANGER
						? "You cannot delete admin manager account that have PSL assigned to them"
						: "You cannot delete PSL account that have installer managers or representatives assigned to them"
				}
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

			{data.role === roles.ADMIN_MANGER && (
				<>
					<Divider sx={{ my: { xs: 16, md: 42 } }} />
					<TableBlock
						heading={"PSLs"}
						subHeading={`These are all the PSLs assigned to ${data?.name}:`}
						tableData={projects.psl}
						addButtonText={"Assign PSL"}
						addButtonClick={() => openAssignDialog("PSL")}
						tableHeaders={projectsHeaders("PSL")}
						emptyStateMessage={"There are no PSL present. Please assign a PSL"}
						disabledAddButton={!allUsers.psl?.length}
						addButtonTooltip={!allUsers.psl?.length ? `No ${projects.psl?.length ? "more " : ""}PSL available now` : ""}
						detailsPagePath={allRoutes.VIEW_ADMIN}
					/>
				</>
			)}

			{data.role === roles.PSL && (
				<>
					<Divider sx={{ my: { xs: 16, md: 42 } }} />
					<TableBlock
						heading={"Installer Managers"}
						subHeading={`These are all the managers assigned to ${data?.name}:`}
						tableData={projects.managers}
						addButtonText={"Assign Manager"}
						addButtonClick={() => openAssignDialog("Installer Manager")}
						tableHeaders={projectsHeaders("Installer Manager")}
						emptyStateMessage={"There are no managers present. Please assign a manager"}
						disabledAddButton={!allUsers.managers?.length}
						addButtonTooltip={!allUsers.managers?.length ? "No managers available now" : ""}
						detailsPagePath={allRoutes.VIEW_MANAGER}
					/>

					<Divider sx={{ my: { xs: 16, md: 42 } }} />
					<TableBlock
						heading={"Representatives"}
						subHeading={`These are all the representatives assigned to ${data?.name}:`}
						tableData={projects.representatives}
						addButtonText={"Assign Representative"}
						addButtonClick={() => openAssignDialog("Representative")}
						tableHeaders={projectsHeaders("Representative")}
						emptyStateMessage={"There are no representatives present. Please assign a representative"}
						disabledAddButton={!allUsers.representatives?.length}
						addButtonTooltip={!allUsers.representatives?.length ? "No representatives available now" : ""}
						detailsPagePath={allRoutes.VIEW_REPRESENTATIVE}
					/>
				</>
			)}

			<AssignPSLDialog
				open={!!assignDialog}
				activeUser={data}
				onClose={closeAssignDialog}
				onSuccess={() => getDetails(false)}
				type={assignDialog || undefined}
			/>

			<UnassignPSLDialog
				open={!!unassignDialog.type}
				activeUser={data}
				onClose={closeUnassignDialog}
				onSuccess={() => getDetails(false)}
				selected={{ id: unassignDialog.id, name: unassignDialog.name }}
				type={unassignDialog.type || undefined}
			/>

			<DeleteDialog
				open={openDeleteDialog}
				onDelete={handleDelete}
				onClose={closeDialog}
				userType="Admin"
				user={data}
			/>
		</PageLayout>
	);
};

export default AdminDetails;
