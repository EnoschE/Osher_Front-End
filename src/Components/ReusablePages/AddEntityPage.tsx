// import { FormEvent, useState } from "react";
// import { UserState } from "../../Redux/Slices/userSlice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import PageLayout from "../PageLayout/PageLayout";
// import { allRoutes } from "../../Routes/AllRoutes";
// import { validateEmail, validatePassword } from "../../Utils/utils";
// import CustomForm, { FormField } from "../Common/CustomForm";
// import { addBrand } from "../../Services/brandsService";
// import { FormOnChange } from "../../Utils/types";
// import { useTranslation } from "react-i18next";

// interface BrandState extends UserState {
//   confirmPassword?: string;
// }

// const defaultData = {
//   picture: "",
//   name: "",
//   email: "",
//   phone: "",
//   address: "",
//   password: "",
//   confirmPassword: "",
// };

// const AddBrand = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [data, setData] = useState<BrandState>(defaultData);
//   const [errors, setErrors] = useState<BrandState>(defaultData);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleOnChange = ({ name, value }: FormOnChange) => {
//     setData((state) => ({ ...state, [name]: value }));
//     setErrors((state) => ({
//       ...state,
//       [name]:
//         name === "email" && value
//           ? validateEmail(value)
//           : name === "password" && value
//           ? validatePassword(value)
//           : name === "confirmPassword" && value
//           ? data.password === value
//             ? ""
//             : "Passwords do not match"
//           : "",
//     }));
//   };

//   const validateData = () => {
//     const updatedErrors = { ...errors };

//     updatedErrors.name = data.name ? "" : "Name cannot be empty";
//     updatedErrors.address = data.address ? "" : "Address cannot be empty";
//     updatedErrors.phone = data.phone ? "" : "Phone Number cannot be empty";
//     updatedErrors.email = validateEmail(data.email);
//     updatedErrors.password = validatePassword(data.password);
//     updatedErrors.confirmPassword =
//       data.password === data.confirmPassword ? "" : "Passwords do not match";

//     setErrors(updatedErrors);
//     return !Object.values(updatedErrors).find(Boolean);
//   };

//   const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateData()) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("picture", data.picture ?? "");
//       formData.append("name", data.name ?? "");
//       formData.append("email", data.email ?? "");
//       formData.append("address", data.address ?? "");
//       formData.append("phone", data.phone ?? "");
//       formData.append("password", data.password ?? "");

//       await addBrand(formData);

//       toast.success(t("Brand added successfully!"));
//       navigate(allRoutes.BRANDS);
//     } catch (error: any) {
//       if (error.includes("A brand with this email already exists")) {
//         setErrors({ ...errors, email: error });
//       } else {
//         toast.error(t(error));
//       }
//     }
//     setLoading(false);
//   };

//   const handleCancel = () => navigate(allRoutes.BRANDS);

//   const fields: FormField[] = [
//     {
//       label: "Brand Photo",
//       placeholder: "This will be displayed on the profile of Brand",
//       name: "picture",
//       type: "image",
//       value: data.picture,
//       onChange: handleOnChange,
//     },
//     {
//       required: true,
//       label: "Name",
//       placeholder: "Name",
//       name: "name",
//       type: "text",
//       value: data.name,
//       onChange: handleOnChange,
//       error: errors.name,
//     },
//     {
//       required: true,
//       label: "Email",
//       placeholder: "@example",
//       name: "email",
//       type: "email",
//       value: data.email,
//       onChange: handleOnChange,
//       error: errors.email,
//     },
//     {
//       required: true,
//       label: "Address",
//       placeholder: "Address",
//       name: "address",
//       type: "text",
//       value: data.address,
//       onChange: handleOnChange,
//       error: errors.address,
//     },
//     {
//       required: true,
//       label: "Phone Number",
//       placeholder: "Phone Number",
//       name: "phone",
//       type: "phone",
//       value: data.phone,
//       onChange: handleOnChange,
//       error: errors.phone,
//     },
//     {
//       required: true,
//       label: "Password",
//       placeholder: "********",
//       name: "password",
//       type: "password",
//       value: data.password,
//       onChange: handleOnChange,
//       error: errors.password,
//     },
//     {
//       required: true,
//       label: "Confirm Password",
//       placeholder: "********",
//       name: "confirmPassword",
//       type: "password",
//       value: data.confirmPassword,
//       onChange: handleOnChange,
//       error: errors.confirmPassword,
//     },
//   ];

//   return (
//     <PageLayout loading={loading}>
//       <CustomForm
//         heading='Add new Brand'
//         subHeading='Please provide the details to add a new brand'
//         fields={fields}
//         onSave={handleUpdate}
//         onCancel={handleCancel}
//       />
//     </PageLayout>
//   );
// };

// export default AddBrand;

import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import {
  FormOnChange,
  // PageDetailsField,
  UserRoleType,
} from "../../Utils/types";
// import ProfileHeader from "../Common/ProfileHeader";
// import PageDetailsBlock, {
//   commonDetailsPageFields,
// } from "../Common/PageDetailsBlock";
// import DeleteDialog from "../Common/DeleteDialog";
import {
  isBrandLoggedIn,
  // isSuperAdminLoggedIn,
  // isUserLoggedIn,
} from "../../Services/userService";
import { useTranslation } from "react-i18next";
// import { allRoutes } from "../../Routes/AllRoutes";
// import TableBlock from "../Common/Table/TableBlock";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import CustomForm, {
  FormFieldWithValue,
  FormField,
} from "../Common/CustomForm";
import { validateEmail, validatePassword } from "../../Utils/utils";

interface AddEntityPageProps {
  entityType: UserRoleType;
  // getDetailsFn?: (id: string) => Promise<any>;
  // deleteFn?: (id: string) => Promise<any>;
  addFn: (formData: FormData) => Promise<any>;
  fields: FormField[];
  backRoute: string;
  // checkEditAccess?: (props: any) => boolean;
  // isMyProfilePage?: boolean;
  getExtraSectionData?: (prop: any) => {
    getItemsFn: () => Promise<any>;
    heading: string;
    subHeading: string;
    headers: Array<any>;
    emptyStateMessage: string;
    detailsPagePath: string;
  };
}

const AddEntityPage = ({
  entityType,
  // getDetailsFn,
  // deleteFn,
  addFn,
  fields,
  backRoute,
}: // checkEditAccess,
// isMyProfilePage,
// getExtraSectionData,
AddEntityPageProps) => {
  const { t } = useTranslation();
  // const { id } = useParams();
  const navigate = useNavigate();
  // const isSuperAdmin = isSuperAdminLoggedIn();
  // const isLoggedIn = isUserLoggedIn();
  const isBrand = isBrandLoggedIn();
  const user = useSelector(selectUser);

  const [data, setData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  // const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  // const extraSectionData = getExtraSectionData?.(data);
  const dependency = isBrand ? [user, isBrand] : [];

  useEffect(() => {
    if (isBrand && entityType === "Ad") {
      setData((state: any) => ({ ...state, brandId: user._id || "" }));
    }
  }, dependency);

  // useEffect(() => {
  //   if (extraSectionData) {
  //     const fetchItems = async () => {
  //       setLoading(true);
  //       try {
  //         const response: any = await extraSectionData.getItemsFn();
  //         setItems(
  //           response?.map((item: any) => ({
  //             value: item._id,
  //             text: item.name,
  //             picture: item.picture,
  //           })) || []
  //         );
  //       } catch (error) {
  //         toast.error(t("Failed to fetch brands"));
  //       }
  //       setLoading(false);
  //     };

  //     fetchItems();
  //   }
  // }, []);

  // useEffect(() => {
  //   getDetails();
  // }, [dependency]);

  // const getDetails = async () => {
  //   // TODO: Important if influencer logged in, and he opens the influencerDetails page with his id it should take him to MYPROFILE page, same for brand etc

  //   if (isMyProfilePage) {
  //     if (!user._id) return;
  //   } else {
  //     if (!id && backRoute)
  //       return navigate(isLoggedIn ? backRoute : allRoutes.FEED);
  //   }

  //   setLoading(true);
  //   try {
  //     if (isMyProfilePage) {
  //       if (user && !data._id) setData(user);
  //     } else {
  //       const response = await getDetailsFn?.(id || "");
  //       setData(response);
  //     }

  //     if (!!extraSectionData) {
  //       const userId = (isMyProfilePage ? user?._id : id) || "";
  //       const itemsResponse: any = await extraSectionData?.getItemsFn(userId);
  //       setItems(itemsResponse || []);
  //     }
  //   } catch (err: any) {
  //     toast.error(t(err));
  //     if (!isMyProfilePage && backRoute) {
  //       if (err.includes("not available") || err.includes("id was not found"))
  //         navigate(isLoggedIn ? backRoute : allRoutes.FEED);
  //       else navigate(backRoute);
  //     }
  //   }
  //   setLoading(false);
  // };

  // const handleUpdate = async () => {
  //   if (!deleteFn) return;

  //   try {
  //     const result = await deleteFn(id || "");
  //     if (result?.includes("successfully")) {
  //       toast.success(t(result));
  //       if (backRoute) navigate(backRoute);
  //     }
  //   } catch (err: any) {
  //     toast.error(t(err));
  //     if (backRoute) navigate(backRoute);
  //   }
  // };

  const handleOnChange = ({ name, value }: FormOnChange) => {
    setData((state: any) => ({ ...state, [name]: value }));
    setErrors((state: any) => ({
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

    fields.forEach((field) => {
      if (field.required) {
        if (field.name === "email") {
          updatedErrors[field.name] = validateEmail(data[field.name]);
        } else if (field.name === "password") {
          updatedErrors[field.name] = validatePassword(data[field.name]);
        } else if (field.name === "confirmPassword" && !!data[field.name]) {
          updatedErrors[field.name] =
            data.password === data.confirmPassword
              ? ""
              : "Passwords do not match";
        } else if (!data[field.name]) {
          updatedErrors[field.name] = `${field.label} cannot be empty`;
        }
      } else {
        updatedErrors[field.name] = "";
      }
    });

    // updatedErrors.name = data.name ? "" : "Name cannot be empty";
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

      fields.forEach((field) => {
        if (field.name) {
          formData.append(field.name, data[field.name] || "");
        }
      });

      // formData.append("picture", data.picture ?? "");
      // formData.append("name", data.name ?? "");
      // formData.append("email", data.email ?? "");
      // formData.append("address", data.address ?? "");
      // formData.append("phone", data.phone ?? "");
      // formData.append("password", data.password ?? "");

      await addFn(formData);

      toast.success(t(`${entityType} added successfully!`));
      navigate(backRoute);
    } catch (error: any) {
      if (error.includes("email already exists")) {
        if (fields.some((field) => field.name === "email")) {
          setErrors({ ...errors, email: error });
        } else {
          toast.error(t(error));
        }
      } else {
        toast.error(t(error));
      }
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(backRoute);

  const formFields: FormFieldWithValue[] = fields.map((field) => ({
    ...field,
    value: data[field.name],
    onChange: handleOnChange,
    error: field.required ? errors[field.name] : undefined,
  }));

  return (
    <PageLayout loading={loading}>
      {/* <ProfileHeader
        isSquarish={["Post", "Ad"].includes(entityType)}
        data={data}
        userType={entityType}
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={!canEditOrDelete}
        isLoading={loading}
        hideDeleteButton={!deleteFn}
      /> */}

      {/* <PageDetailsBlock
        data={data}
        fields={detailsBlockFields}
        isLoading={loading}
        showBottomDivider={!!extraSectionData}
      /> */}

      <CustomForm
        heading={`Add new ${entityType}`}
        subHeading={`Please provide the details to add a new ${entityType.toLowerCase()}`}
        fields={formFields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default AddEntityPage;
