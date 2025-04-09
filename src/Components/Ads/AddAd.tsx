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
import { addBrand, getAllBrands } from "../../Services/brandsService";
import { addAd } from "../../Services/adsService";
import { useSelector } from "../../Redux/reduxHooks";
import { selectCategories } from "../../Redux/Slices/categoriesSlice";
import { FormOnChange } from "../../Utils/types";

interface AdState {
  name: string;
  video: string;
  brandId: string;
  categoryId: string;
  description: string;
  picture: any;
}

const defaultData = {
  name: "",
  video: "",
  brandId: "",
  categoryId: "",
  description: "",
  picture: "",
};

const AddAd = () => {
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);

  const [data, setData] = useState<AdState>(defaultData);
  const [errors, setErrors] = useState<AdState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response: any = await getAllBrands();
        setBrands(
          response?.map((item: any) => ({
            value: item._id,
            text: item.name,
            picture: item.picture,
          })) || []
        );
      } catch (error) {
        toast.error("Failed to fetch brands");
      }
      setLoading(false);
    };

    fetchBrands();
  }, []);

  const handleOnChange = ({ name, value }: FormOnChange) => {
    setData((state) => ({ ...state, [name]: value }));
    setErrors((state) => ({
      ...state,
      [name]: "",
      // name === "email" && value
      //   ? validateEmail(value)
      //   : name === "password" && value
      //   ? validatePassword(value)
      //   : name === "confirmPassword" && value
      //   ? data.password === value
      //     ? ""
      //     : "Passwords do not match"
      //   : "",
    }));
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

    // updatedErrors.address = data.address ? "" : "Address cannot be empty";
    // updatedErrors.phone = data.phone ? "" : "Phone Number cannot be empty";
    // updatedErrors.email = validateEmail(data.email);
    // updatedErrors.password = validatePassword(data.password);
    // updatedErrors.confirmPassword =
    //   data.password === data.confirmPassword ? "" : "Passwords do not match";

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

      await addAd(formData);

      toast.success("Ad added successfully!");
      navigate(allRoutes.ADS);
    } catch (error: any) {
      if (error.includes("An Ad with this name already exists")) {
        setErrors({ ...errors, name: error });
      } else {
        toast.error(error);
      }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.BRANDS);

  // if (!body.name) error = "Name is missing";
  // if (!body.description) error = "Description is missing";
  // if (!body.categoryId) error = "Category is not selected";
  // if (!body.brandId) error = "Brand is not selected";
  // if (!body.quantity) error = "Quantity is missing";
  // if (!body.video) error = "Video is missing";
  // if (!body.pictures) error = "Pictures are missing";
  // if (!body.publishDate) error = "ublishDate is missing";
  // if (!body.expiryDate) error = "expiryDate is missing";

  const fields: FormField[] = [
    {
      label: "Ad Photo",
      placeholder: "This will be displayed on the profile of Ad",
      name: "picture",
      type: "image",
      value: data.picture,
      onChange: handleOnChange,
      required: true,
      error: errors.picture,
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
  ];

  // TODO: move errors logic to customForm and we can extra errors here as well for additional cases

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Add new Ad'
        subHeading='Please provide the details to add a new Ad'
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default AddAd;
