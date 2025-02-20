import { FormEvent, useEffect, useState } from "react";
import { UserState } from "../../../Redux/Slices/userSlice";
import CustomButton from "../../Common/CustomButton";
import CustomTextField, { Asterisk } from "../../Common/CustomTextField";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../Common/ImageUploader";
import * as EmailValidator from "email-validator";
import GoogleMapsTextField, { PlaceType } from "../../Common/GoogleMapsTextField";
import PageLayout from "../../PageLayout/PageLayout";
import { allRoutes } from "../../../Routes/AllRoutes";
import { getInstallerCompanyDetails, updateInstallerCompany } from "../../../Services/dashboardService";
import { TagsInput } from "../../Common/CustomTagComponent";

interface AccountSettingsData extends UserState {
	_id?: string;
	changePassword?: string;
	zipCodes?: string;
	addressObject?: PlaceType | null;
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
	zipCodes: "",
};

const EditInstallerCompany = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [zipCodes, setZipCodes] = useState<string[]>([]);
	const [errors, setErrors] = useState<AccountSettingsData | Record<any, any>>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<any>("");

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.CUSTOMERS);

		setLoading(true);
		try {
			const { data: userData } = await getInstallerCompanyDetails((id || "")?.toString());

			const currentData = {
				_id: userData?._id || "",
				name: userData?.name || "",
				email: userData?.email || "",
				addressObject: {
					description: userData.address,
					structured_formatting: {
						main_text: userData.address,
						secondary_text: userData.address,
					},
				},
				phone: userData?.phone || "",
			};
			setData(currentData);
			setZipCodes(userData?.zipCodes || []);
			setProfilePicture(userData?.image || userData?.ImageUrl || "");
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData((state) => ({ ...state, [name]: value }));
		setErrors((state) => ({ ...state, [name]: "" }));
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
		updatedErrors.email = data.email
			? !EmailValidator.validate(data.email)
				? "Enter a valid email"
				: ""
			: "Email cannot be empty";
		updatedErrors.zipCodes = zipCodes.length > 0 ? "" : "Zip Codes cannot be empty";
		// updatedErrors.address = data.addressObject?.description ? "" : "Address cannot be empty";

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
			// formData.append("address", data.addressObject?.description ?? "");
			formData.append("phone_no", data.phone ?? "");
			formData.append("zipCodes", JSON.stringify(zipCodes ?? []));

			await updateInstallerCompany(data?._id || "", formData);

			toast.success("Installer Company updated successfully!");
			navigate(-1);
		} catch (error: any) {
			let specificError = error;
			if (specificError.includes("This email already exists.")) {
				specificError = "A company with this email already exists.";
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
			<Typography variant="h5">Edit Installer Company</Typography>
			<Typography fontSize={15} mt={10}>
				Update photo and personal details of installer company
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
						<Typography variant="h5">Company Logo</Typography>
						<Typography fontSize={15} mt={10}>
							This will be displayed on installer company's dashboard
						</Typography>
					</Box>
					<Box>
						<ImageUploader isLogo onUpdate={handleSelectImage} imageFile={profilePicture} />
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
						Phone Number
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.phone}
						error={errors.phone}
						name="phone"
						placeholder="+1"
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
						forInstallerCompany
					/>

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Save Changes</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default EditInstallerCompany;
