import { FormEvent, useState } from "react";
import { UserState } from "../../Redux/Slices/userSlice";
import CustomButton from "../Common/CustomButton";
import CustomTextField, { Asterisk } from "../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../Common/ImageUploader";
import * as EmailValidator from "email-validator";
import GoogleMapsTextField, { PlaceType } from "../Common/GoogleMapsTextField";
import PageLayout from "../PageLayout/PageLayout";
import { addNewCustomer } from "../../Services/dashboardService";
import { allRoutes } from "../../Routes/AllRoutes";
import { validatePassword } from "../../Utils/utils";
import MuiPhoneNumber from "material-ui-phone-number";
import EmailSentDialog from "../Common/EmailSentModal";
import CustomDropdown from "../Common/CustomDropdown";
import { leadStatuses } from "../../Utils/enums";

interface AccountSettingsData extends UserState {
	confirmPassword?: string;
	addressObject?: PlaceType | null;
	currentStep?: string;
	status?: string;
	leadStatus?: string;
	lastName?: string
}

const defaultData = {
	name: "",
	lastName: "",
	email: "",
	addressObject: null,
	bill: "",
	phone: "",
	leadStatus: ""
};

const AddCustomer = () => {
	const navigate = useNavigate();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<any>("");
	const [open, setOpen] = useState<boolean>(false);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData((state) => ({ ...state, [name]: value }));
		setErrors((state) => ({ ...state, [name]: name === "password" ? validatePassword(value) : "" }));
	};

	const handleAddress = (value: PlaceType | null) => {
		setData((state) => ({ ...state, addressObject: value }));
		setErrors((state) => ({ ...state, address: "" }));
	};

	const handleSelectImage = (image: any) => {
		setProfilePicture(image);
	};

	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.name = data.name ? "" : "First Name cannot be empty";
		updatedErrors.lastName = data.lastName ? "" : "Last Name cannot be empty";
		updatedErrors.phone = data.phone ? "" : "Phone number cannot be empty";
		updatedErrors.email = data.email
			? !EmailValidator.validate(data.email)
				? "Enter a valid email"
				: ""
			: "Email cannot be empty";
		updatedErrors.address = data.addressObject?.description ? "" : "Address cannot be empty";
		updatedErrors.bill = data.bill
			? parseFloat(data.bill?.toString() || "") <= 0
				? "Electricity bill must be greater than 0"
				: ""
			: "Electricity bill cannot be empty";
		// updatedErrors.password = validatePassword(data.password);
		// updatedErrors.confirmPassword = data.confirmPassword
		// 	? data.confirmPassword !== data.password
		// 		? "Password does not match"
		// 		: ""
		// 	: "Confirm password cannot be empty";

		setErrors(updatedErrors);
		return !Object.values(updatedErrors).find(Boolean);
	};

	function onClose() {
		navigate(allRoutes.CUSTOMERS);
	}

	const handleDropdown = (value: string, key: string) => {
		setData((state) => ({ ...state, [key]: value }));
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateData()) return;

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("ImageUrl", profilePicture ?? "");
			formData.append("name", data.name ?? "");
			formData.append("lastName", data.lastName ?? "");
			formData.append("email", data.email ?? "");
			formData.append("address", data.addressObject?.description ?? "");
			formData.append("electricity_usage", data.bill?.toString() ?? "");
			formData.append("phone_no", data.phone ?? "");
			formData.append("leadStatus", data.leadStatus ?? "")
			// formData.append("password", data.password ?? "");

			await addNewCustomer(formData);

			setOpen(true);
		} catch (error: any) {
			let specificError = error;
			if (specificError.includes("This email already exists.")) {
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
			<Typography variant="h5">Add new customer</Typography>
			<Typography fontSize={15} mt={10}>
				Add photo and personal details of customer
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
							This will be displayed on customer's profile
						</Typography>
					</Box>
					<Box>
						<ImageUploader onUpdate={handleSelectImage} imageFile={profilePicture} />
					</Box>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						First Name
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
						Last Name
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.lastName}
						name="lastName"
						placeholder="Last Name"
						error={errors.lastName}
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
						<Asterisk />
					</Typography>
					<GoogleMapsTextField
						placeholder="Address"
						value={data.addressObject}
						onChange={handleAddress}
						error={errors.address}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Electricity Bill
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.bill}
						error={errors.bill?.toString()}
						name="bill"
						type="number"
						placeholder="2500"
						endIcon={<>/Mo</>}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Phone Number
						<Asterisk />
					</Typography>
					{/* <CustomTextField
						onChange={handleOnChange}
						value={data.phone}
						error={errors.phone}
						name="phone"
						placeholder="+1"
					/> */}
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
						Lead Status
					</Typography>
					<CustomDropdown
						options={Object.values(leadStatuses).map((val) => ({ value: val, text: val }))}
						value={data.leadStatus}
						onChange={(value: string) => handleDropdown(value, "leadStatus")}
						minWidth="100%"
					/>

					<EmailSentDialog open={open} onClose={onClose}></EmailSentDialog>
					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Add Customer</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default AddCustomer;
