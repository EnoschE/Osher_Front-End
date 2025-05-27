import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { FormOnChange, UserRoleType } from "../../Utils/types";
import { isBrandLoggedIn } from "../../Services/userService";
import { useTranslation } from "react-i18next";
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
