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
import { editBrand, getBrandById } from "../../Services/brandsService";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { validateEmail, validatePassword } from "../../Utils/utils";
import { updateProfile } from "../../Services/profileService";
import CustomForm, { FormField } from "../Common/CustomForm";

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

const EditAd = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [data, setData] = useState<AccountSettingsData>(defaultData);
  const [errors, setErrors] = useState<AccountSettingsData>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);
  // const [otpDialog, setOtpDialog] = useState<boolean>(false);
  // const [updatingEmail, setUpdatingEmail] = useState<any>("");

  // useEffect(() => {
  //   if (user) {
  //     const userData = {
  //       name: user.name,
  //       email: user.email,
  //       address: user.address,
  //       phone: user.phone,
  //       picture: user.picture,
  //     };
  //     setData(userData);
  //   }
  // }, [user]);

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
      let newEmail;
      if (user.email?.trim() !== data.email?.trim()) {
        newEmail = data.email;
        // setUpdatingEmail(newEmail);
      }

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
      onChange: (picture: any) => setData((state) => ({ ...state, picture })),
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
    <PageLayout loading={loading}>
      <CustomForm
        heading='Edit Brand'
        subHeading={`Edit the details of ${data?.name}`}
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

export default EditAd;
