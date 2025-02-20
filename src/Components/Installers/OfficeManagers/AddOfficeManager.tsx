import { FormEvent, useEffect, useState } from "react";
import { UserState } from "../../../Redux/Slices/userSlice";
import CustomButton from "../../Common/CustomButton";
import CustomTextField, { Asterisk } from "../../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageUploader from "../../Common/ImageUploader";
import * as EmailValidator from "email-validator";
import GoogleMapsTextField, { PlaceType } from "../../Common/GoogleMapsTextField";
import PageLayout from "../../PageLayout/PageLayout";
import { allRoutes } from "../../../Routes/AllRoutes";
import { validatePassword } from "../../../Utils/utils";
import { roles } from "../../../Utils/tokenKeyValue";
import MuiPhoneNumber from "material-ui-phone-number";
import { getAllInstallerCompanies, createNewInstaller } from "../../../Services/dashboardService";
import CustomDropdown from "../../Common/CustomDropdown";
import EmailSentDialog from "../../Common/EmailSentModal";

interface AccountSettingsData extends UserState {
	confirmPassword?: string;
	addressObject?: PlaceType | null;
	currentStep?: string;
	status?: string;
	companyId?: string;
}

const defaultData = {
	name: "",
	email: "",
	addressObject: null,
	bill: "",
	phone: "",

	companyId: "",
};

const AddOfficeManager = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<any>("");
	const [companies, setCompanies] = useState<Array<any>>([]);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		setLoading(true);
		try {
			let { data: allCompanies } = await getAllInstallerCompanies();

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

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData((state) => ({ ...state, [name]: value }));
		setErrors((state) => ({ ...state, [name]: name === "password" ? validatePassword(value) : "" }));
	};

	const handleAddress = (value: PlaceType | null) => {
		setData((state) => ({ ...state, addressObject: value }));
		setErrors((state) => ({ ...state, address: "" }));
	};

	const handleDropdown = (value: string, key: string) => {
		setData((state) => ({ ...state, [key]: value }));
		setErrors((state) => ({ ...state, [key]: "" }));
	};

	const handleSelectImage = (image: any) => {
		setProfilePicture(image);
	};

	const onClose = () => {
		navigate(allRoutes.OFFICE_MANAGERS);
	};
	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.name = data.name ? "" : "Name cannot be empty";
		updatedErrors.phone = data.phone ? "" : "Phone number cannot be empty";
		updatedErrors.companyId = data.companyId ? "" : "Installer company cannot be empty";
		updatedErrors.email = data.email
			? !EmailValidator.validate(data.email)
				? "Enter a valid email"
				: ""
			: "Email cannot be empty";
		// updatedErrors.address = data.addressObject?.description ? "" : "Address cannot be empty";
		// updatedErrors.password = validatePassword(data.password);
		// updatedErrors.confirmPassword = data.confirmPassword
		// 	? data.confirmPassword !== data.password
		// 		? "Password does not match"
		// 		: ""
		// 	: "Confirm password cannot be empty";

		setErrors(updatedErrors);
		return !Object.values(updatedErrors).find(Boolean);
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateData()) return;

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("ImageUrl", profilePicture ?? "");
			formData.append("name", data.name ?? "");
			formData.append("email", data.email ?? "");
			formData.append("address", data.addressObject?.description ?? "");
			formData.append("electricity_usage", data.bill?.toString() ?? "");
			formData.append("phone_no", data.phone ?? "");
			formData.append("role", roles.OFFICE_MANAGER);
			formData.append("companyId", data.companyId ?? "");

			await createNewInstaller(formData);

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
			<Typography variant="h5">Add new office manager</Typography>
			<Typography fontSize={15} mt={10}>
				Add photo and personal details of office manager
			</Typography>
			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdate}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="center"
				>
					<Box alignSelf="flex-start">
						<Typography variant="h5">Photo</Typography>
						<Typography fontSize={15} mt={10}>
							This will be displayed on office manager's profile
						</Typography>
					</Box>
					<Box>
						<ImageUploader onUpdate={handleSelectImage} imageFile={profilePicture} />
					</Box>

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
						Address
					</Typography>
					<GoogleMapsTextField
						placeholder="Address"
						value={data.addressObject}
						onChange={handleAddress}
						error={errors.address}
					/>

					{/* <Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Electricity Bill
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.bill}
						error={errors.bill?.toString()}
						name="bill"
						type="number"
						placeholder="2500"
						endIcon={<>/Mo</>}
					/> */}

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Phone Number
						<Asterisk />
					</Typography>
					<MuiPhoneNumber
						defaultCountry={"us"}
						autoComplete="off"
						onChange={(phoneNumber: any) => {
							setData({ ...data, phone: phoneNumber.toString() });
							if (errors.phone) setErrors({ ...errors, phone: "" });
						}}
						error={!!errors.phone}
						helperText={errors.phone}
						fullWidth
						variant="outlined"
						size="small"
						value={data.phone}
						required
						InputLabelProps={{ shrink: true }}
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

					<EmailSentDialog open={open} onClose={onClose}></EmailSentDialog>
					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Add Office Manager</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default AddOfficeManager;
