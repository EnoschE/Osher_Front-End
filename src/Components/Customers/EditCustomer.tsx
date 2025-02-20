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
import StatusChip from "../Common/StatusChip";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { borderRadius } from "../../Utils/spacings";
import { allRoutes } from "../../Routes/AllRoutes";
import {
	changeTechnician,
	getAllTechnicians,
	getAssignedInstaller,
	getAssignedTechnician,
	getCustomerDetails,
	updateCustomer,
} from "../../Services/dashboardService";
import CustomDropdown from "../Common/CustomDropdown";
import MuiPhoneNumber from "material-ui-phone-number";
import { isDirectorLoggedIn, isSuperAdminLoggedIn } from "../../Services/userService";
import { leadStatuses } from "../../Utils/enums";

interface AccountSettingsData extends UserState {
	_id?: string;
	changePassword?: string;
	addressObject?: PlaceType | null;
	currentStep?: string;
	status?: string;
	technicianId?: string;
	installerId?: string;
	electricity_bill?: string;
	supplyCharges?: string;
	deliveryCharges?: string;
	uploadedBillCost?: string;
	leadStatus?: string;
	monthlyElectricityUsage?: { [key: string]: string };
	lastName?: string;
}

let defaultData: AccountSettingsData = {
	_id: "",
	name: "",
	lastName: "",
	email: "",
	addressObject: null,
	bill: "",
	phone: "",
	leadStatus: "",
	changePassword: "",
	technicianId: "",
	installerId: "",
};

const EditCustomer = () => {
	const colors = useSelector(selectColors);
	const { id } = useParams();
	const navigate = useNavigate();

	const isSuperAdmin = isSuperAdminLoggedIn();
	const isDirector = isDirectorLoggedIn();

	if (isSuperAdmin || isDirector) {
		defaultData = {
			...defaultData,
			supplyCharges: "",
			deliveryCharges: "",
			uploadedBillCost: "",
			monthlyElectricityUsage: {
				January: "",
				February: "",
				March: "",
				April: "",
				May: "",
				June: "",
				July: "",
				August: "",
				September: "",
				October: "",
				November: "",
				December: "",
			},
		};
	}

	const [data, setData] = useState<AccountSettingsData>(defaultData);
	const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<any>("");
	const [allTechnicians, setAllTechnicians] = useState<Array<any>>([]);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		if (!id) navigate(allRoutes.CUSTOMERS);

		setLoading(true);
		try {
			const { data: userData } = await getCustomerDetails((id || "")?.toString());

			const [{ data: myInstaller }, { data: myTechnician }, { data: technicians }] = await Promise.all([
				getAssignedInstaller((userData?._id || "")?.toString()),
				getAssignedTechnician((userData?._id || "")?.toString()),
				getAllTechnicians(),
			]);

			console.log("Assigned Installer: ", myInstaller);
			console.log("Assigned Technician: ", myTechnician);

			let currentData: any = {
				_id: userData?._id || "",
				name: userData?.name || "",
				lastName: userData?.lastName || "",
				email: userData?.email || "",
				addressObject: {
					description: userData.address,
					structured_formatting: {
						main_text: userData.address,
						secondary_text: userData.address,
					},
				},
				bill: userData?.bill || "",
				phone: userData?.phone_no || userData?.phone || "",
				status: userData?.status || "",
				currentStep: userData?.currentStep || "",
				leadStatus: userData?.leadStatus || "",
				technicianId: myTechnician?._id || "",
				installerId: myInstaller?._id || "",
			};
			console.log(userData.electricity_bill && (isSuperAdmin || isDirector));
			if (userData.electricity_bill && (isSuperAdmin || isDirector)) {
				currentData = {
					...currentData,
					electricity_bill: userData?.electricity_bill || "",

					supplyCharges: userData?.supplyCharges || "",
					deliveryCharges: userData?.deliveryCharges || "",
					uploadedBillCost: userData?.uploadedBillCost || "",
					monthlyElectricityUsage: {
						January: userData?.monthlyElectricityUsage?.January || "",
						February: userData?.monthlyElectricityUsage?.February || "",
						March: userData?.monthlyElectricityUsage?.March || "",
						April: userData?.monthlyElectricityUsage?.April || "",
						May: userData?.monthlyElectricityUsage?.May || "",
						June: userData?.monthlyElectricityUsage?.June || "",
						July: userData?.monthlyElectricityUsage?.July || "",
						August: userData?.monthlyElectricityUsage?.August || "",
						September: userData?.monthlyElectricityUsage?.September || "",
						October: userData?.monthlyElectricityUsage?.October || "",
						November: userData?.monthlyElectricityUsage?.November || "",
						December: userData?.monthlyElectricityUsage?.December || "",
					},
				};
			}
			console.log(currentData);
			setData(currentData);
			setProfilePicture(userData?.image || "");

			const techniciansValues = technicians.map((item: any) => ({ ...item, value: item._id, text: item.name }));
			setAllTechnicians(techniciansValues);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleDropdown = (value: string, key: string) => {
		setData((state) => ({ ...state, [key]: value }));
	};

	const handleAddress = (value: PlaceType | null) => {
		setData((state) => ({ ...state, addressObject: value }));
		setErrors((state) => ({ ...state, address: "" }));
	};

	const handleSelectImage = (image: any) => {
		setProfilePicture(image);
	};

	const validateData = () => {
		console.log({ errors });
		const updatedErrors: any = { ...errors };

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
		if (data.monthlyElectricityUsage && (isSuperAdmin || isDirector)) {
			updatedErrors.supplyCharges = data.supplyCharges
				? parseFloat(data.supplyCharges?.toString() || "") <= 0
					? "Supply Charges must be greater than 0"
					: ""
				: "Supply Charges  cannot be empty";

			updatedErrors.deliveryCharges = data.deliveryCharges
				? parseFloat(data.deliveryCharges?.toString() || "") <= 0
					? "Delivery Charges must be greater than 0"
					: ""
				: "Delivery Charges  cannot be empty";
			updatedErrors.uploadedBillCost = data.uploadedBillCost
				? parseFloat(data.uploadedBillCost?.toString() || "") <= 0
					? "Uploaded Bill Cost must be greater than 0"
					: ""
				: "Uploaded Bill Cost  cannot be empty";
		}

		if (data.monthlyElectricityUsage && (isSuperAdmin || isDirector)) {
			console.log(updatedErrors);
			updatedErrors.monthlyElectricityUsage.January = data.monthlyElectricityUsage.January ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.February = data.monthlyElectricityUsage.February ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.March = data.monthlyElectricityUsage.March ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.April = data.monthlyElectricityUsage.April ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.May = data.monthlyElectricityUsage.May ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.June = data.monthlyElectricityUsage.June ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.July = data.monthlyElectricityUsage.July ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.August = data.monthlyElectricityUsage.August ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.September = data.monthlyElectricityUsage.September ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.October = data.monthlyElectricityUsage.October ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.November = data.monthlyElectricityUsage.November ? "" : "Fill it";
			updatedErrors.monthlyElectricityUsage.December = data.monthlyElectricityUsage.December ? "" : "Fill it";
		}
		setErrors(updatedErrors);
		let foundError = Object.values(updatedErrors).find(Boolean);
		console.log(foundError);
		if (typeof foundError === "object") {
			foundError = Object.values(updatedErrors.monthlyElectricityUsage).find(Boolean);
		}
		return !foundError;
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
			formData.append("leadStatus", data.leadStatus ?? "");

			if (data.electricity_bill && (isSuperAdmin || isDirector)) {
				formData.append("deliveryCharges", data.deliveryCharges ?? "");
				formData.append("uploadedBillCost", data.uploadedBillCost ?? "");
				formData.append("supplyCharges", data.supplyCharges ?? "");
				formData.append("monthlyElectricityUsage", JSON.stringify(data.monthlyElectricityUsage));
			}

			await updateCustomer(data?._id || "", formData);

			if (data.technicianId) {
				const payload = {
					userId: data?._id,
					technicianId: data.technicianId,
				};
				await changeTechnician(data?._id || "", payload);
			}

			toast.success("Customer information updated successfully!");
			navigate(-1);
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
	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		isSubValue: boolean,
		parentKey?: keyof AccountSettingsData,
	) => {
		const { name, value } = e.target;
		if (isSubValue && parentKey && typeof data[parentKey] === "object" && data[parentKey] !== null) {
			setData((prevState) => ({
				...prevState,
				[parentKey]: {
					...(prevState[parentKey] as Record<string, any>),
					[name]: value,
				},
			}));
		} else {
			setData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}

		setErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	};

	return (
		<PageLayout loading={loading}>
			<Typography variant="h5">Edit Customer</Typography>
			<Typography fontSize={15} mt={10}>
				Update photo and personal details of customer
			</Typography>
			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdate}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="start"
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
						error={errors.name}
						name="name"
						placeholder="Name"
					/>
					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Last Name
						<Asterisk />
					</Typography>
					<CustomTextField
						onChange={handleOnChange}
						value={data.lastName}
						error={errors.lastName}
						name="lastName"
						placeholder="Last Name"
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
						disabled={!isSuperAdminLoggedIn()}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Phone Number
						<Asterisk />
					</Typography>
					<MuiPhoneNumber
						defaultCountry={"us"}
						autoComplete="off"
						onChange={(phoneNumber: any) => setData({ ...data, phone: phoneNumber.toString() })}
						fullWidth
						variant="outlined"
						size="small"
						value={data.phone}
						required
						error={!!errors.phone}
						helperText={errors.phone}
						InputLabelProps={{ shrink: true }}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Assigned Installation Crew
					</Typography>
					<CustomDropdown
						options={allTechnicians}
						value={data.technicianId}
						onChange={(value: string) => handleDropdown(value, "technicianId")}
						minWidth="100%"
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

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Project Step
					</Typography>
					<Box
						display="flex"
						alignItems={{ xs: "flex-start", md: "center" }}
						gap={10}
						justifyContent="flex-start"
						flexDirection={{ xs: "column", md: "row" }}
						sx={{
							bgcolor: colors.primary + "09",
							border: `1.5px dotted ${colors.primary}`,
							padding: 16,
							borderRadius: borderRadius.md,
						}}
					>
						<Typography fontSize={16} color="primary" fontWeight={600}>
							{data.currentStep}
						</Typography>
						<StatusChip status={data.status} />
						<CustomButton
							variant="outlined"
							sx={{ py: 8, px: 14, ml: { xs: "unset", md: "auto" } }}
							onClick={() => navigate(allRoutes.UPDATE_STATUS?.replace(":id", id || ""))}
						>
							Change Status
						</CustomButton>
					</Box>

					{data.electricity_bill && (isSuperAdmin || isDirector) && (
						<>
							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								Supply Charges
								<Asterisk />
							</Typography>
							<CustomTextField
								onChange={handleOnChange}
								value={data.supplyCharges}
								error={errors.supplyCharges?.toString()}
								name="supplyCharges"
								type="number"
								placeholder="20"
								disabled={!isSuperAdminLoggedIn()}
							/>
							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								Delivery Charges
								<Asterisk />
							</Typography>
							<CustomTextField
								onChange={handleOnChange}
								value={data.deliveryCharges}
								error={errors.deliveryCharges?.toString()}
								name="deliveryCharges"
								type="number"
								placeholder="20"
								disabled={!isSuperAdminLoggedIn()}
							/>
							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
								Uploaded Bill Cost
								<Asterisk />
							</Typography>
							<CustomTextField
								onChange={handleOnChange}
								value={data.uploadedBillCost}
								error={errors.uploadedBillCost?.toString()}
								name="uploadedBillCost"
								type="number"
								placeholder="200"
								disabled={!isSuperAdminLoggedIn()}
							/>

							<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }} alignSelf="center">
								Monthly Electricity Usage
								<Asterisk />
							</Typography>

							<Box
								display="grid"
								alignItems="flex-start"
								gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }}
								gap={{ xs: 10, md: 32 }}
								sx={{
									padding: 16,
									bgcolor: colors.primary + "09",
									border: `1.5px dotted ${colors.primary}`,
									borderRadius: borderRadius.md,
								}}
							>
								{data.monthlyElectricityUsage &&
									Object.keys(data.monthlyElectricityUsage).map((month) => (
										<CustomTextField
											key={month}
											label={month}
											type="number"
											name={month}
											error={(errors.monthlyElectricityUsage ? errors.monthlyElectricityUsage[month] : "") as string}
											value={data.monthlyElectricityUsage ? data.monthlyElectricityUsage[month] : ""}
											placeholder="Enter usage"
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleOnChange(e, true, "monthlyElectricityUsage")
											}
											onFocus={(e: any) =>
												e.target.addEventListener("wheel", (e: any) => e.preventDefault(), { passive: false })
											}
										/>
									))}
							</Box>

							{/* If monthlyElectricityUsage is an object with dynamic keys, you might need a different approach */}
						</>
					)}
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

export default EditCustomer;
