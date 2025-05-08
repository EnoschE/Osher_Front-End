import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import CustomForm, { FormFieldWithValue } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";
import { getAllInfluencers } from "../../Services/influencersService";
import { addPost } from "../../Services/postsService";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { isInfluencerLoggedIn } from "../../Services/userService";
import { useTranslation } from "react-i18next";

interface PostState {
  name: string;
  video: string;
  userId: string;
  description: string;
  picture: any;
}

const defaultData = {
  name: "",
  video: "",
  userId: "",
  description: "",
  picture: "",
};

const AddPost = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isInfluencer = isInfluencerLoggedIn();

  const [data, setData] = useState<PostState>(defaultData);
  const [errors, setErrors] = useState<PostState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<any>>([]);

  useEffect(() => {
    if (isInfluencer) {
      setData({ ...defaultData, userId: user._id || "" });
    }
  }, [user, isInfluencer]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        const response: any = await getAllInfluencers();
        setUsers(
          response?.map((item: any) => ({
            value: item._id,
            text: item.name,
            picture: item.picture,
          })) || []
        );
      } catch (error) {
        toast.error(t("Failed to fetch influencers"));
      }
      setLoading(false);
    };

    fetchInfluencers();
  }, []);

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
    updatedErrors.userId = data.userId ? "" : "Influencer cannot be empty";

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
      formData.append("userId", data.userId ?? "");
      formData.append("description", data.description ?? "");

      await addPost(formData);

      toast.success(t("Post added successfully!"));
      navigate(allRoutes.POSTS);
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.POSTS);

  const fields: FormFieldWithValue[] = [
    {
      label: "Post Photo",
      placeholder: "This will be the photo of post",
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
      label: "Influencer",
      placeholder: "Select Influencer",
      name: "userId",
      type: "dropdown",
      value: data.userId,
      onChange: handleOnChange,
      error: errors.userId,
      options: users,
      disabled: isInfluencer,
    },
  ];

  return (
    <PageLayout loading={loading}>
      <CustomForm
        heading='Add new Post'
        subHeading='Please provide the details to add a new Post'
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default AddPost;
