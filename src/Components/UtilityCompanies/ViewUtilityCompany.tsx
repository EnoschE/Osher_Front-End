import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";
import { toast } from "react-toastify";
import StatusChip from "../Common/StatusChip";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { deleteUtilityCompany, getSingleUtilityCompany } from "../../Services/utilityCompaniesService";
import RenderZipCodes from "./RenderZipCodes";

const ViewUtilityCompany = () => {
	const colors = useSelector(selectColors);
	const navigate = useNavigate();
	const { id } = useParams();

	const [data, setData] = useState<any | null>(null);
	const [zipCodes, setZipCodes] = useState<string[]>([]);
	const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.UTILITY_COMPANIES_PAGE);

		setLoading(true);
		try {
			const { data: utilityCompany } = await getSingleUtilityCompany(id || "");
			setData({
				name: utilityCompany?.name || "",
				utilityRate: utilityCompany?.utilityRate || "",
				_id: utilityCompany?._id || "",
				zipCodes: utilityCompany?.zipCodes || [],
			});
			setZipCodes(utilityCompany?.zipCodes || []);
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};
	const openDeleteDialog = () => setDeleteDialog(true);
	const closeDeleteDialog = () => setDeleteDialog(false);

	const handleEdit = () => navigate(allRoutes.EDIT_UTILITY_COMPANY.replace(":id", (id || "")?.toString()));

	const handleDelete = async () => {
		console.log("Handle Delete called");
		setLoading(true);
		try {
			await deleteUtilityCompany(data?._id || "");

			toast.success("Utility Company  deleted successfully!");
			navigate(allRoutes.UTILITY_COMPANIES_PAGE);
		} catch (error: any) {
			toast.error(error);
		} finally {
			setLoading(false);
		}
	};

	const fields = [
		{ text: "Name", key: "name" },
		{ text: "Utility Rate", key: "utilityRate" },
	];

	return (
		<PageLayout loading={loading}>
			{data && (
				<>
					<ProfileHeader
						data={data}
						userType="Utility Company"
						handleEdit={handleEdit}
						handleDelete={openDeleteDialog}
					/>

					<Box
						display="grid"
						gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
						gap={{ xs: 10, md: 32 }}
						alignItems="start"
						mt={45}
					>
						{fields?.map((field) => (
							<React.Fragment key={field.key}>
								<Typography variant="h6">{field.text}</Typography>
								<Typography>{data[field.key as any] || "Not given"}</Typography>
							</React.Fragment>
						))}
						<RenderZipCodes values={zipCodes} />
					</Box>

					<DeleteDialog
						open={deleteDialog}
						onClose={closeDeleteDialog}
						userType="Utility Company"
						user={data}
						onDelete={handleDelete}
					/>
				</>
			)}
		</PageLayout>
	);
};

export default ViewUtilityCompany;
