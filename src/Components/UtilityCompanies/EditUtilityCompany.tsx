import { FormEvent, useEffect, useState } from "react";
import CustomButton from "../Common/CustomButton";
import CustomTextField, { Asterisk } from "../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { TagsInput } from "../Common/CustomTagComponent";
import { getSingleUtilityCompany, updateUtilityCompany } from "../../Services/utilityCompaniesService";
import { allRoutes } from "../../Routes/AllRoutes";

export interface UtilityCompany {
	name: string;
	utilityRate: number;
	_id?: string;
}

export interface UtilityCompanyErrors {
	name?: string;
	utilityRate?: string;
	zipCodes?: string;
}
const defaultData = {
	name: "",
	utilityRate: "",
	zipCodes: [],
};

const EditUtilityCompany = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { id } = useParams();

	const [data, setData] = useState<UtilityCompany>(defaultData as any);
	const [zipCodes, setZipCodes] = useState<string[]>([]);

	const [errors, setErrors] = useState<UtilityCompanyErrors>({});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.UTILITY_COMPANIES_PAGE);

		setLoading(true);
		try {
			const { data: utilityCompany } = await getSingleUtilityCompany((id || "")?.toString());

			const currentData = {
				name: utilityCompany?.name || "",
				utilityRate: utilityCompany?.utilityRate || "",
				_id: utilityCompany?._id || "",
			};
			setData(currentData);
			setZipCodes(utilityCompany?.zipCodes || []);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData((state) => ({ ...state, [name]: value }));
		setErrors((state: any) => ({ ...state, [name]: "" }));
	};

	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.name = data.name ? "" : "Name cannot be empty";
		updatedErrors.utilityRate = data.utilityRate ? "" : "Utility Rate be empty";
		updatedErrors.zipCodes = zipCodes.length > 0 ? "" : "Zip Codes cannot be empty";

		setErrors(updatedErrors);
		return !Object.values(updatedErrors).find(Boolean);
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateData()) return;

		setLoading(true);
		try {
			await updateUtilityCompany({ ...data, zipCodes }, data?._id as string);

			toast.success("Utility Company updated successfully!");
			navigate(allRoutes.UTILITY_COMPANIES_PAGE);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<PageLayout loading={loading}>
			<Typography variant="h5">Edit utility company</Typography>
			<Typography fontSize={15} mt={10}>
				Edit details of utility company
			</Typography>
			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdate}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="start"
				>
					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Name
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.name}
						name="name"
						placeholder="Name"
						error={errors.name}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Utility Rate
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.utilityRate}
						error={errors.utilityRate}
						name="utilityRate"
						type="number"
						placeholder="0.3"
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Zip Codes
						<Asterisk />
					</Typography>

					<TagsInput
						errors={errors}
						setErrors={setErrors}
						minLength={5}
						maxLength={5}
						value={zipCodes}
						onChange={setZipCodes}
						name="zipCodes"
						placeHolder="Enter Zip Codes"
						type="number"
					/>

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Edit Utility Company</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default EditUtilityCompany;
