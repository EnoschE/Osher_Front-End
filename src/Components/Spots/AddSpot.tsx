import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import CustomForm, { FormFieldWithValue } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";
import { useTranslation } from "react-i18next";
import { addSpot } from "../../Services/spotsService";

interface SpotState {
  name: string;
  information: string;
  picture: any;
  location: any;
  phone: any;
}

const defaultData = {
  name: "",
  information: "",
  picture: "",
  location: "",
  phone: "",
};

const AddSpot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState<SpotState>(defaultData);
  const [errors, setErrors] = useState<SpotState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnChange = ({ name, value }: FormOnChange) => {
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({ ...state, [name]: "" }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.picture = data.picture ? "" : "Picture cannot be empty";
    updatedErrors.name = data.name ? "" : "Name cannot be empty";
    updatedErrors.location = data.location ? "" : "Location cannot be empty";
    updatedErrors.information = data.information
      ? ""
      : "Information cannot be empty";

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
      formData.append("information", data.information ?? "");
      formData.append("location", data.location ?? "");
      formData.append("phone", data.phone ?? "");

      await addSpot(formData);

      toast.success(t("Spot added successfully!"));
      navigate(allRoutes.SPOTS);
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.SPOTS);

  const fields: FormFieldWithValue[] = [
    {
      label: "Spot Photo",
      placeholder: "This will be the photo of spot",
      name: "picture",
      type: "image",
      value: data.picture,
      onChange: handleOnChange,
      required: true,
      error: errors.picture,
      isSquarish: true,
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
      label: "Information",
      placeholder: "Information",
      name: "information",
      type: "text",
      value: data.information,
      onChange: handleOnChange,
      error: errors.information,
      multiline: true,
    },
    {
      required: true,
      label: "Location",
      placeholder: "Location",
      name: "location",
      value: data.location,
      onChange: handleOnChange,
      error: errors.location,
    },
    {
      label: "Phone Number",
      placeholder: "Phone Number",
      name: "phone",
      type: "phone",
      value: data.phone,
      error: errors.phone,
      onChange: handleOnChange,
    },
  ];

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Add new Spot'
        subHeading='Please provide the details to add a new Spot'
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default AddSpot;
