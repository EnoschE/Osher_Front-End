import { FormEvent, useState } from "react";
import { UserState } from "../../Redux/Slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { validateEmail, validatePassword } from "../../Utils/utils";
import CustomForm, { FormField } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";
import { addInfluencer } from "../../Services/influencersService";

interface MainState extends UserState {
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

const AddInfluencer = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<MainState>(defaultData);
  const [errors, setErrors] = useState<MainState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnChange = ({ name, value }: FormOnChange) => {
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

      await addInfluencer(formData);

      toast.success("Influencer added successfully!");
      navigate(allRoutes.INFLUENCERS);
    } catch (error: any) {
      if (error.includes("An influencer with this email already exists")) {
        setErrors({ ...errors, email: error });
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.INFLUENCERS);

  const fields: FormField[] = [
    {
      label: "Influencer Photo",
      placeholder: "This will be displayed on the profile of Influencer",
      name: "picture",
      type: "image",
      value: data.picture,
      onChange: handleOnChange,
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
      onChange: handleOnChange,
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
        heading="Add new Influencer"
        subHeading="Please provide the details to add a new influencer"
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default AddInfluencer;
