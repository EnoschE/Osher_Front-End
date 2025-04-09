import { FormEvent, useEffect, useState } from "react";
import { selectUser, UserState } from "../../Redux/Slices/userSlice";
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
import {
  getCustomerDetails,
  updateCustomer,
} from "../../Services/dashboardService";
import {
  editBrand,
  getAllBrands,
  getBrandById,
} from "../../Services/brandsService";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { validateEmail, validatePassword } from "../../Utils/utils";
import { updateProfile } from "../../Services/profileService";
import CustomForm, { FormField } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";
import { editAd, getAdById } from "../../Services/adsService";
import { selectCategories } from "../../Redux/Slices/categoriesSlice";

// interface AccountSettingsData extends UserState {
//   _id?: string;
//   changePassword?: string;
// }

// const defaultData = {
//   name: "",
//   email: "",
//   addressObject: null,
//   bill: "",
//   phone: "",
//   password: "",
//   _id: "",
//   changePassword: "",
// };

// const EditBrand = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState<AccountSettingsData>(defaultData);
//   const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [profilePicture, setProfilePicture] = useState<any>("");

//   useEffect(() => {
//     getDetails();
//   }, []);

//   const getDetails = async () => {
//     if (!id) navigate(allRoutes.BRANDS);

//     setLoading(true);
//     try {
//       const data: any = await getBrandById((id || "")?.toString());

//       const currentData = {
//         _id: data?._id || "",
//         name: data?.name || "",
//         email: data?.email || "",
//         phone: data?.phone_no || data?.phone || "",
//       };
//       setData(currentData);
//       setProfilePicture(data?.image || "");
//     } catch (error: any) {
//       toast.error(error);
//     }
//     setLoading(false);
//   };

//   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setData((state) => ({ ...state, [name]: value }));
//     setErrors((state) => ({ ...state, [name]: "" }));
//   };

//   const handleAddress = (value: PlaceType | null) => {
//     setData((state) => ({ ...state, addressObject: value }));
//     setErrors((state) => ({ ...state, address: "" }));
//   };

//   const handleSelectImage = (image: any) => {
//     setProfilePicture(image);
//   };

//   const validateData = () => {
//     const updatedErrors = { ...errors };

//     updatedErrors.name = data.name ? "" : "Name cannot be empty";
//     updatedErrors.email = data.email
//       ? !EmailValidator.validate(data.email)
//         ? "Enter a valid email"
//         : ""
//       : "Email cannot be empty";
//     // updatedErrors.address = data.addressObject?.description ? "" : "Address cannot be empty";

//     setErrors(updatedErrors);
//     return !Object.values(updatedErrors).find(Boolean);
//   };

//   const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateData()) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("ImageUrl", profilePicture ?? "");
//       formData.append("name", data.name ?? "");
//       formData.append("email", data.email ?? "");
//       formData.append("address", data.addressObject?.description ?? "");
//       formData.append("electricity_usage", data.bill?.toString() ?? "");
//       formData.append("phone_no", data.phone ?? "");

//       await updateCustomer(data._id || "", formData);

//       toast.success("Installation crew information updated successfully!");
//       navigate(-1);
//     } catch (error: any) {
//       let specificError = error;
//       if (specificError.includes("This email already exists.")) {
//         specificError = "A user with this email already exists.";
//         setErrors({ ...errors, email: specificError });
//       } else {
//         toast.error(specificError);
//       }
//     }
//     setLoading(false);
//   };

//   const handleCancel = () => {
//     navigate(-1);
//   };

//   return (
//     <PageLayout loading={loading}>
//       <Typography variant='h5'>Edit Installation Crew</Typography>
//       <Typography fontSize={15} mt={10}>
//         Update photo and personal details of installation crew
//       </Typography>
//       <Divider sx={{ mt: 14, mb: 24 }} />

//       <form onSubmit={handleUpdate}>
//         <Box
//           display='grid'
//           gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
//           gap={{ xs: 10, md: 32 }}
//           alignItems='center'
//         >
//           <Box alignSelf='flex-start'>
//             <Typography variant='h5'>Photo</Typography>
//             <Typography fontSize={15} mt={10}>
//               This will be displayed on installation crew's profile
//             </Typography>
//           </Box>
//           <Box>
//             <ImageUploader
//               onUpdate={handleSelectImage}
//               imageFile={profilePicture}
//             />
//           </Box>

//           <Typography variant='h6' fontSize={18} mt={{ xs: 12, md: 0 }}>
//             Name
//             <Asterisk />
//           </Typography>
//           <CustomTextField
//             onChange={handleOnChange}
//             value={data.name}
//             name='name'
//             placeholder='Name'
//           />

//           <Typography variant='h6' fontSize={18} mt={{ xs: 12, md: 0 }}>
//             Email address
//             <Asterisk />
//           </Typography>
//           <CustomTextField
//             onChange={handleOnChange}
//             value={data.email}
//             error={errors.email}
//             name='email'
//             type='email'
//             placeholder='@example'
//           />

//           <Typography variant='h6' fontSize={18} mt={{ xs: 12, md: 0 }}>
//             Address
//           </Typography>
//           <GoogleMapsTextField
//             placeholder='Address'
//             value={data.addressObject}
//             onChange={handleAddress}
//             error={errors.address}
//           />

//           <Typography variant='h6' fontSize={18} mt={{ xs: 12, md: 0 }}>
//             Phone Number
//           </Typography>
//           <CustomTextField
//             onChange={handleOnChange}
//             value={data.phone}
//             error={errors.phone}
//             name='phone'
//             placeholder='+1'
//           />

//           <Box />
//           <Box
//             display='flex'
//             alignItems='center'
//             justifyContent='flex-end'
//             gap={20}
//           >
//             <CustomButton
//               variant='outlined'
//               color='secondary'
//               onClick={handleCancel}
//             >
//               Cancel
//             </CustomButton>
//             <CustomButton type='submit'>Save Changes</CustomButton>
//           </Box>
//         </Box>
//       </form>
//     </PageLayout>
//   );
// };

// export default EditBrand;

interface AdState {
  _id: string;
  name: string;
  video: string;
  brandId: string;
  categoryId: string;
  description: string;
  picture: any;
}

const defaultData = {
  _id: "",
  name: "",
  video: "",
  brandId: "",
  categoryId: "",
  description: "",
  picture: "",
};

const EditAd = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
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
        toast.error("Failed to fetch brands"); // TODO: move these to redux as well
      }
      setLoading(false);
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.ADS);

    setLoading(true);
    try {
      const adData: any = await getAdById((id || "")?.toString());
      setData(adData);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

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

      await editAd(data._id, formData);

      toast.success("Ad updated successfully!");
      navigate(allRoutes.VIEW_AD.replace(":id", (id || "")?.toString()));
      // }
    } catch (error: any) {
      // if (error.includes("Incorrect current password")) {
      //   setErrors({ ...errors, password: error });
      // } else if (error.includes("A brand with this email already exists")) {
      //   setErrors({ ...errors, email: error });
      // } else {
      toast.error(error);
      // }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.ADS);

  // const openOtpDialog = () => setOtpDialog(true);
  // const closeOtpDialog = () => setOtpDialog(false);

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

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Edit Ad'
        subHeading={`Edit the details of ${data?.name}`}
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditAd;
