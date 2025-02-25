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
import { validateEmail, validatePassword } from "../../Utils/utils";
import { registerNewTechnician } from "../../Services/technicianService";
import EmailSentDialog from "../Common/EmailSentModal";
import CustomDropdown from "../Common/CustomDropdown";
import { getAllInstallerCompanies } from "../../Services/dashboardService";
import CustomForm, { FormField } from "../Common/CustomForm";
import { addBrand } from "../../Services/brandsService";

interface BrandState extends UserState {
  confirmPassword?: string;
}

const defaultData = {
  picture: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
};

const AddAd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<BrandState>(defaultData);
  const [errors, setErrors] = useState<BrandState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setData((state) => ({ ...state, [name]: value }));
  //   setErrors((state) => ({
  //     ...state,
  //     [name]: name === "password" ? validatePassword(value) : "",
  //   }));
  // };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({
      ...state,
      [name]:
        name === "email" && value
          ? validateEmail(value)
          : name === "password" && value
          ? validatePassword(value)
          : name === "confirmPassword" && value
          ? data.password === value
            ? ""
            : "Passwords do not match"
          : "",
    }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.name = data.name ? "" : "Name cannot be empty";
    updatedErrors.address = data.address ? "" : "Address cannot be empty";
    updatedErrors.phone = data.phone ? "" : "Phone Number cannot be empty";
    updatedErrors.email = validateEmail(data.email);
    updatedErrors.password = validatePassword(data.password);
    updatedErrors.confirmPassword =
      data.password === data.confirmPassword ? "" : "Passwords do not match";

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).find(Boolean);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateData()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("picture", data.picture ?? "");
      formData.append("name", data.name ?? "");
      formData.append("email", data.email ?? "");
      formData.append("address", data.address ?? "");
      formData.append("phone", data.phone ?? "");
      formData.append("password", data.password ?? "");

      await addBrand(formData);

      toast.success("Brand added successfully!");
      navigate(allRoutes.BRANDS);
    } catch (error: any) {
      if (error.includes("A brand with this email already exists")) {
        setErrors({ ...errors, email: error });
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.BRANDS);

  const fields: FormField[] = [
    {
      label: "Brand Photo",
      placeholder: "This will be displayed on the profile of Brand",
      name: "profilePicture",
      type: "image",
      value: data.picture,
      onChange: (picture: any) => setData((state) => ({ ...state, picture })),
    },
    {
      required: true,
      label: "Name",
      placeholder: "Name",
      name: "name",
      type: "text",
      value: data.name,
      onChange: handleOnChange,
      error: errors.name,
    },
    {
      required: true,
      label: "Email",
      placeholder: "@example",
      name: "email",
      type: "email",
      value: data.email,
      onChange: handleOnChange,
      error: errors.email,
    },
    {
      required: true,
      label: "Address",
      placeholder: "Address",
      name: "address",
      type: "text",
      value: data.address,
      onChange: handleOnChange,
      error: errors.address,
    },
    {
      required: true,
      label: "Phone Number",
      placeholder: "Phone Number",
      name: "phone",
      type: "phone",
      value: data.phone,
      onChange: (phone: string) => {
        setData({ ...data, phone });
        setErrors({
          ...errors,
          phone: phone ? "" : "Phone Number cannot be empty",
        });
      },
      error: errors.phone,
    },
    {
      required: true,
      label: "Password",
      placeholder: "********",
      name: "password",
      type: "password",
      value: data.password,
      onChange: handleOnChange,
      error: errors.password,
    },
    {
      required: true,
      label: "Confirm Password",
      placeholder: "********",
      name: "confirmPassword",
      type: "password",
      value: data.confirmPassword,
      onChange: handleOnChange,
      error: errors.confirmPassword,
    },
  ];

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Add new Brand'
        subHeading='Please provide the details to add a new brand'
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
      {/* <Typography variant="h5">Add new Brand</Typography>
			<Typography fontSize={15} mt={10}>
				After Registration it will send a email to brand to add his information.
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
			</form> */}
    </PageLayout>
  );
};

export default AddAd;
