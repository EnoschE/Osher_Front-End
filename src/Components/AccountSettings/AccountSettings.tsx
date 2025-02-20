import { FormEvent, useEffect, useState } from "react";
import { UserState, selectUser } from "../../Redux/Slices/userSlice";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { updateProfile } from "../../Services/profileService";
// import OtpVerifyDialog from "./OtpVerifyDialog";
import PageLayout from "../PageLayout/PageLayout";
import { validateEmail, validatePassword } from "../../Utils/utils";
import CustomForm, { FormField } from "../Common/CustomForm";

interface AccountSettingsData extends UserState {
  newPassword?: string;
  picture?: any;
}

const defaultData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  newPassword: "",
};

const AccountSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [data, setData] = useState<AccountSettingsData>(defaultData);
  const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);
  // const [otpDialog, setOtpDialog] = useState<boolean>(false);
  // const [updatingEmail, setUpdatingEmail] = useState<any>("");

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        picture: user.picture,
      };
      setData(userData);
    }
  }, [user]);

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
          : "",
    }));
  };

  const handleSelectImage = (image: any) => {
    setData((state) => ({ ...state, picture: image }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.name = data.name ? "" : "Name cannot be empty";
    updatedErrors.email = validateEmail(data.email);
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
      let newEmail;
      if (user.email?.trim() !== data.email?.trim()) {
        newEmail = data.email;
        // setUpdatingEmail(newEmail);
      }

      const formData = new FormData();
      // formData.append("picture", profilePicture ?? "");
      formData.append("picture", data.picture ?? "");
      formData.append("name", data.name ?? "");
      formData.append("email", data.email ?? "");
      formData.append("address", data.address ?? "");
      formData.append("phone", data.phone ?? "");
      formData.append("password", data.password ?? "");
      formData.append("newPassword", data.newPassword ?? "");

      await dispatch(updateProfile(formData));

      // if (newEmail) {
      //   // setting the old email in input field, if user decides to close the verify otp dialog the input will display the active previous email of user
      //   setData((state) => ({ ...state, email: user.email }));
      //   openOtpDialog();
      // } else {
      toast.success("Profile updated successfully!");
      // }
    } catch (error: any) {
      if (error.includes("Incorrect current password")) {
        setErrors({ ...errors, password: error });
      } else if (error.includes("A user with this email already exists")) {
        setErrors({ ...errors, email: error });
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate(allRoutes.DASHBOARD);
  };

  // const openOtpDialog = () => setOtpDialog(true);
  // const closeOtpDialog = () => setOtpDialog(false);

  const fields: FormField[] = [
    {
      label: "Your Photo",
      placeholder: "This will be displayed on your profile",
      name: "profilePicture",
      type: "image",
      // value: profilePicture,
      value: data.picture,
      onChange: handleSelectImage,
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
      label: "Address",
      placeholder: "Address",
      name: "address",
      type: "text",
      value: data.address,
      onChange: handleOnChange,
      error: errors.address,
    },
    {
      label: "Phone Number",
      placeholder: "Phone Number",
      name: "phone",
      type: "phone",
      value: data.phone,
      onChange: (phone: string) => setData({ ...data, phone }),
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
    <PageLayout loading={loading} hideBackButton>
      <CustomForm
        heading='Account Settings'
        subHeading='Update your photo and personal details'
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

export default AccountSettings;
