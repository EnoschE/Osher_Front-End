import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getAllBrands } from "../../Services/brandsService";
import CustomForm, { FormFieldWithValue } from "../Common/CustomForm";
import { useSelector } from "../../Redux/reduxHooks";
import { FormOnChange } from "../../Utils/types";
import { editAd, getAdById } from "../../Services/adsService";
import { selectCategories } from "../../Redux/Slices/categoriesSlice";
import { isBrandLoggedIn } from "../../Services/userService";
import { selectUser } from "../../Redux/Slices/userSlice";
import { useTranslation } from "react-i18next";
import { Days, States, TimeSlots } from "../../Utils/enums";

interface AdState {
  _id: string;
  name: string;
  video: string;
  brandId: string;
  categoryId: string;
  description: string;
  picture: any;
  timeSlots: string[];
  days: string[];
  states: string[];
}

const defaultData = {
  _id: "",
  name: "",
  video: "",
  brandId: "",
  categoryId: "",
  description: "",
  picture: "",
  timeSlots: [],
  days: [],
  states: [],
};

const defaultErrorsData = {
  name: "",
  video: "",
  brandId: "",
  categoryId: "",
  description: "",
  picture: "",
  timeSlots: "",
  days: "",
  states: "",
};

const EditAd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const isBrand = isBrandLoggedIn();
  const user = useSelector(selectUser);

  const [data, setData] = useState<AdState>(defaultData);
  const [errors, setErrors] = useState(defaultErrorsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<Array<any>>([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.ADS);

    setLoading(true);
    try {
      const adData: any = await getAdById((id || "")?.toString());
      setData(adData);
      if (isBrand && adData.brandId !== user._id) {
        toast.error(t("You are not allowed to edit this ad"));
        navigate(allRoutes.ADS);
        return;
      }

      const response: any = await getAllBrands();
      setBrands(
        response?.map((item: any) => ({
          value: item._id,
          text: item.name,
          picture: item.picture,
        })) || []
      );
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleOnChange = ({ name, value }: FormOnChange) => {
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({ ...state, [name]: "" }));
  };

  const validateData = () => {
    const updatedErrors = { ...errors };

    updatedErrors.picture = data.picture ? "" : "Picture cannot be empty";
    updatedErrors.name = data.name ? "" : "Name cannot be empty";
    updatedErrors.description = data.description
      ? ""
      : "Description cannot be empty";
    updatedErrors.brandId = data.brandId ? "" : "Brand cannot be empty";
    updatedErrors.categoryId = data.categoryId
      ? ""
      : "Category cannot be empty";
    updatedErrors.timeSlots = !!data.timeSlots?.length
      ? ""
      : "Time slots cannot be empty";
    updatedErrors.days = !!data.days?.length ? "" : "Days cannot be empty";
    updatedErrors.states = !!data.states?.length
      ? ""
      : "States cannot be empty";

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
      formData.append("categoryId", data.categoryId ?? "");
      formData.append("brandId", data.brandId ?? "");
      formData.append("description", data.description ?? "");
      formData.append("timeSlots", JSON.stringify(data.timeSlots) ?? "");
      formData.append("days", JSON.stringify(data.days) ?? "");
      formData.append("states", JSON.stringify(data.states) ?? "");

      await editAd(data._id, formData);

      toast.success(t("Ad updated successfully!"));
      navigate(allRoutes.VIEW_AD.replace(":id", (id || "")?.toString()));
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.ADS);

  const fields: FormFieldWithValue[] = [
    {
      label: "Ad Photo",
      placeholder: "This will be displayed on the profile of Ad",
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
      label: "Description",
      placeholder: "Description",
      name: "description",
      type: "text",
      value: data.description,
      onChange: handleOnChange,
      error: errors.description,
      multiline: true,
    },
    {
      required: true,
      label: "Brand",
      placeholder: "Select Brand",
      name: "brandId",
      type: "dropdown",
      value: data.brandId,
      onChange: handleOnChange,
      error: errors.brandId,
      options: brands,
      disabled: isBrand,
    },
    {
      required: true,
      label: "Category",
      placeholder: "Select Category",
      name: "categoryId",
      type: "dropdown",
      value: data.categoryId,
      onChange: handleOnChange,
      error: errors.categoryId,
      options: categories.map((category) => ({
        value: category._id,
        text: category.name,
      })),
    },
    {
      required: true,
      label: "Time Slots",
      placeholder: "Select time slots",
      name: "timeSlots",
      type: "multiselect",
      value: data.timeSlots,
      onChange: handleOnChange,
      error: errors.timeSlots,
      options: TimeSlots.map((day) => ({ text: day, value: day })),
    },
    {
      required: true,
      label: "Days",
      placeholder: "Select days",
      name: "days",
      type: "multiselect",
      value: data.days,
      onChange: handleOnChange,
      error: errors.days,
      options: Days.map((day) => ({ text: day, value: day })),
    },
    {
      required: true,
      label: "States",
      placeholder: "Select States",
      name: "states",
      type: "multiselect",
      value: data.states,
      onChange: handleOnChange,
      error: errors.states,
      isLargeButtons: true,
      options: States.map((state) => ({ text: state.name, value: state.name })),
    },
  ];

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Edit Ad'
        subHeading={`Edit the details of Ad`}
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditAd;
