import { FormEvent, useEffect, useState } from "react";
import { UserState } from "../../Redux/Slices/userSlice";
import CustomButton from "../Common/CustomButton";
import CustomTextField, { Asterisk } from "../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../Common/ImageUploader";
import * as EmailValidator from "email-validator";
import GoogleMapsTextField, { PlaceType } from "../Common/GoogleMapsTextField";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getCustomerDetails, updateAccountDetails, updateCustomer } from "../../Services/dashboardService";
import MuiPhoneNumber from "material-ui-phone-number";
import { validatePassword } from "../../Utils/utils";

interface AccountSettingsData extends UserState {
	_id?: string;
	changePassword?: string;
	addressObject?: PlaceType | null;
	phone_no?: string;
	userId?: string;
	ImageUrl?: string;
	tokenKey?: any;
}

const defaultData = {
	_id: "",
	name: "",
	email: "",
	addressObject: null,
	bill: "",
	phone: "",
	password: "",
	changePassword: "",
};

const EditCustomer = ({ tokenFormData, token }: { tokenFormData?: AccountSettingsData; token?: string }) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<any>("");

	useEffect(() => {
		if (!tokenFormData) {
			getDetails();
		} else {
			setData({ ...tokenFormData, phone: tokenFormData.phone_no });
			setProfilePicture(tokenFormData.ImageUrl);
		}
	}, [tokenFormData]);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.CUSTOMERS);

		setLoading(true);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());

			const currentData = {
				_id: userData?._id,
				name: userData?.name || "",
				email: userData?.email || "",
				addressObject: {
					description: userData.address,
					structured_formatting: {
						main_text: userData.address,
						secondary_text: userData.address,
					},
				},
				phone: userData?.phone_no || userData?.phone ||"",
			};
			setData(currentData);
			setProfilePicture(userData?.image || "");
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

	const handleSelectImage = (image: any) => {
		setProfilePicture(image);
	};

	const validateData = () => {
		const updatedErrors = { ...errors };

		updatedErrors.name = data.name ? "" : "Name cannot be empty";
		updatedErrors.phone = data.phone ? "" : "Phone number cannot be empty";
		updatedErrors.email = data.email
			? !EmailValidator.validate(data.email)
				? "Enter a valid email"
				: ""
			: "Email cannot be empty";
		// updatedErrors.address = data.addressObject?.description ? "" : "Address cannot be empty";
		if (data.password || data.changePassword || tokenFormData) {
			updatedErrors.password = validatePassword(data.password);
			updatedErrors.changePassword = data.changePassword
				? data.changePassword !== data.password
					? "Password does not match"
					: ""
				: "Confirm password cannot be empty";
		}

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

			formData.append(tokenFormData ? "password" : "newPassword", data.password ?? "");

			if (tokenFormData) {
				formData.append("token", token || "");
				await updateAccountDetails(tokenFormData.userId || "", formData);
			} else {
				await updateCustomer(data._id || "", formData);
			}

			toast.success(tokenFormData ? "Profile registered successfully! " : "Admin information updated successfully!");
			tokenFormData ? navigate(allRoutes.HOME) : navigate(-1);
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
		<PageLayout loading={loading} hideLayout={!!tokenFormData}>
			<Typography variant="h5">{tokenFormData ? "Add Your Details 😀" : "Edit Admin"}</Typography>
			<Typography fontSize={15} mt={10}>
				{!tokenFormData
					? "Update photo and personal details of admin"
					: "Add your personal details to complete your registration"}
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
							This will be displayed on admin's profile
						</Typography>
					</Box>
					<Box>
						<ImageUploader onUpdate={handleSelectImage} imageFile={profilePicture} />
					</Box>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Name
						<Asterisk />
					</Typography>
					<CustomTextField onChange={handleOnChange} value={data.name} name="name" placeholder="Name" />

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
						disabled={!!tokenFormData}
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

					{tokenFormData && (
						<>
							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								Password
								<Asterisk></Asterisk>
							</Typography>
							<CustomTextField
								onChange={handleOnChange}
								value={data.password}
								error={errors.password}
								name="password"
								type="password"
								placeholder="********"
								autoComplete="new-password"
							/>

							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								Confirm Password
								<Asterisk></Asterisk>
							</Typography>
							<CustomTextField
								onChange={handleOnChange}
								value={data.changePassword}
								error={errors.changePassword}
								name="changePassword"
								type="password"
								placeholder="********"
								autoComplete="new-password"
							/>
						</>
					)}

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton disabled={loading} variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton disabled={loading} type="submit">
							Save Changes
						</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default EditCustomer;
