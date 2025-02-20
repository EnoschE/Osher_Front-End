import { FormEvent, useEffect, useState } from "react";
import { UserState } from "../../Redux/Slices/userSlice";
import CustomButton from "../Common/CustomButton";
import CustomTextField, { Asterisk } from "../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as EmailValidator from "email-validator";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { validatePassword } from "../../Utils/utils";
import { registerNewTechnician } from "../../Services/technicianService";
import EmailSentDialog from "../Common/EmailSentModal";
import CustomDropdown from "../Common/CustomDropdown";
import { getAllInstallerCompanies } from "../../Services/dashboardService";

interface AccountSettingsData extends UserState {
	confirmPassword?: string;
	currentStep?: string;
	status?: string;
	companyId?: string;
}

const defaultData = {
	name: "",
	email: "",
	companyId: "",
};

const AddTechnician = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [companies, setCompanies] = useState<Array<any>>([]);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		setLoading(true);
		try {
			let { data: allCompanies } = await getAllInstallerCompanies();

			console.log("All Companies: ", allCompanies);

			allCompanies = allCompanies.map((item: any) => ({ ...item, value: item._id, text: item.name })) || [];

			const companyId = searchParams.get("companyId");
			if (companyId) {
				const actualCompanyId = allCompanies?.find((item: any) => item.sequentialId == companyId)?._id;
				setData({ ...data, companyId: actualCompanyId });
			}
			setCompanies(allCompanies);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};


	const handleDropdown = (value: string, key: string) => {
		setData((state) => ({ ...state, [key]: value }));
		setErrors((state) => ({ ...state, [key]: "" }));
	};


	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData((state) => ({ ...state, [name]: value }));
		setErrors((state) => ({ ...state, [name]: name === "password" ? validatePassword(value) : "" }));
	};

	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.name = data.name ? "" : "Name cannot be empty";
		updatedErrors.email = data.email
			? !EmailValidator.validate(data.email)
				? "Enter a valid email"
				: ""
			: "Email cannot be empty";
			updatedErrors.companyId = data.companyId ? "" : "Installer company cannot be empty";

		setErrors(updatedErrors);
		return !Object.values(updatedErrors).find(Boolean);
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateData()) return;

		setLoading(true);
		try {
			const formData = new FormData();
			// formData.append("ImageUrl", profilePicture ?? "");
			formData.append("name", data.name ?? "");
			formData.append("email", data.email ?? "");
			formData.append("companyId", data.companyId || "");
			// formData.append("phone_no", data.phone ?? "");

			await registerNewTechnician(formData);

			setOpen(true);
		} catch (error: any) {
			let specificError = error;
			if (specificError.includes("Email already exists")) {
				specificError = "A user with this email already exists.";
				setErrors({ ...errors, email: specificError });
			} else {
				toast.error(specificError);
			}
		}
		setLoading(false);
	};

	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<PageLayout loading={loading}>
			<Typography variant="h5">Register new Installation Crew</Typography>
			<Typography fontSize={15} mt={10}>
				After Registration it will send a email to installation crew to add his information.
			</Typography>
			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdate}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="center"
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
						Email address
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.email}
						error={errors.email}
						name="email"
						type="email"
						placeholder="@example"
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Installer Company
						<Asterisk />
					</Typography>
					<CustomDropdown
						options={companies}
						value={data.companyId}
						onChange={(value: string) => handleDropdown(value, "companyId")}
						minWidth="100%"
						error={errors.companyId}
						label="Select installer company"
						disabled={searchParams.get("companyId") ? true : false}
					/>

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Register Installation Crew</CustomButton>
					</Box>
					<EmailSentDialog open={open} onClose={() => navigate(allRoutes.TECHNICIANS)} />
				</Box>
			</form>
		</PageLayout>
	);
};

export default AddTechnician;
