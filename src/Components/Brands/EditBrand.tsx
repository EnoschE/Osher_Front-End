import { FormEvent, useEffect, useState } from "react";
import { UserState } from "../../Redux/Slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { editBrand, getBrandById } from "../../Services/brandsService";
import { validateEmail, validatePassword } from "../../Utils/utils";
import CustomForm, { FormField } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";

interface AccountSettingsData extends UserState {
  newPassword?: string;
  picture?: any;
  _id: string;
}

const defaultData = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  newPassword: "",
};

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<AccountSettingsData>(defaultData);
  const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.BRANDS);

    setLoading(true);
    try {
      const data: any = await getBrandById((id || "")?.toString());

      const currentData = {
        _id: data?._id || "",
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        address: data?.address || "",
        picture: data?.picture || "",
      };
      setData(currentData);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleOnChange = ({ name, value }: FormOnChange) => {
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({
      ...state,
      [name]:
        name === "email" && value
          ? validateEmail(value)
          : name === "password" && value
          ? validatePassword(value)
          : "",
    }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.name = data.name ? "" : "Name cannot be empty";
    updatedErrors.email = validateEmail(data.email);
    updatedErrors.address = data.address ? "" : "Address cannot be empty";
    updatedErrors.phone = data.phone ? "" : "Phone Number cannot be empty";
    if (data.password || data.newPassword) {
      updatedErrors.password = validatePassword(data.password);
      updatedErrors.newPassword = data.newPassword
        ? data.newPassword === data.password
          ? "New password should be different"
          : ""
        : "New password cannot be empty";
    }

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).find(Boolean);
  };

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateData()) return;

    setLoading(true);
    try {
      // let newEmail;
      // if (user.email?.trim() !== data.email?.trim()) {
      //   newEmail = data.email;
      //   // setUpdatingEmail(newEmail);
      // }

      const formData = new FormData();

      formData.append("picture", data.picture ?? "");
      formData.append("name", data.name ?? "");
      formData.append("email", data.email ?? "");
      formData.append("address", data.address ?? "");
      formData.append("phone", data.phone ?? "");
      formData.append("password", data.password ?? "");
      formData.append("newPassword", data.newPassword ?? "");

      await editBrand(data._id, formData);

      // if (newEmail) {
      //   // setting the old email in input field, if user decides to close the verify otp dialog the input will display the active previous email of user
      //   setData((state) => ({ ...state, email: user.email }));
      //   openOtpDialog();
      // } else {
      toast.success("Brand updated successfully!");
      navigate(allRoutes.VIEW_BRAND.replace(":id", (id || "")?.toString()));
      // }
    } catch (error: any) {
      if (error.includes("Incorrect current password")) {
        setErrors({ ...errors, password: error });
      } else if (error.includes("A brand with this email already exists")) {
        setErrors({ ...errors, email: error });
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.BRANDS);

  // const openOtpDialog = () => setOtpDialog(true);
  // const closeOtpDialog = () => setOtpDialog(false);

  const fields: FormField[] = [
    {
      label: "Brand Photo",
      placeholder: "This will be displayed on the profile of Brand",
      name: "profilePicture",
      type: "image",
      value: data.picture,
      onChange: handleOnChange,
    },
    {
      required: true,
      label: "Name",
      placeholder: "Name",
      name: "name",
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
      onChange: handleOnChange,
    },
    {
      label: "Password",
      placeholder: "********",
      name: "password",
      type: "password",
      value: data.password,
      onChange: handleOnChange,
      error: errors.password,
    },
    {
      label: "New Password",
      placeholder: "********",
      name: "newPassword",
      type: "password",
      value: data.newPassword,
      onChange: handleOnChange,
      error: errors.newPassword,
    },
  ];

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Edit Brand'
        subHeading={`Edit the details of Brand`}
        fields={fields}
        onSave={handleUpdateProfile}
        onCancel={handleCancel}
      />

      {/* <OtpVerifyDialog
        open={otpDialog}
        onClose={closeOtpDialog}
        email={updatingEmail}
      /> */}
    </PageLayout>
  );
};

export default EditBrand;
