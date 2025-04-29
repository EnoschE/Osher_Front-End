import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import CustomForm, { FormField } from "../Common/CustomForm";
import { FormOnChange } from "../../Utils/types";
import { getAllInfluencers } from "../../Services/influencersService";
import { editPost, getPostById } from "../../Services/postsService";
import { isInfluencerLoggedIn } from "../../Services/userService";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";

interface PostState {
  _id: string;
  name: string;
  userId: string;
  description: string;
  picture: any;
}

const defaultData = {
  _id: "",
  name: "",
  userId: "",
  description: "",
  picture: "",
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isInfluencer = isInfluencerLoggedIn();
  const user = useSelector(selectUser);

  const [data, setData] = useState<PostState>(defaultData);
  const [errors, setErrors] = useState<PostState>(defaultData);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<any>>([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.ADS);

    setLoading(true);
    try {
      const postData: any = await getPostById((id || "")?.toString());
      setData(postData);

      if (isInfluencer && postData.userId !== user._id) {
        toast.error("You are not allowed to edit this post");
        navigate(allRoutes.POSTS);
        return;
      }

      const response: any = await getAllInfluencers();
      setUsers(
        response?.map((item: any) => ({
          value: item._id,
          text: item.name,
          picture: item.picture,
        })) || [],
      );
    } catch (error: any) {
      toast.error(error);
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

      await editPost(data._id, formData);

      toast.success("Post updated successfully!");
      navigate(allRoutes.VIEW_POST.replace(":id", (id || "")?.toString()));
      // }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleCancel = () => navigate(allRoutes.POSTS);

  const fields: FormField[] = [
    {
      label: "Post Photo",
      placeholder: "This will be the photo of post",
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
        heading="Edit Post"
        subHeading={`Edit the details of Post`}
        fields={fields}
        onSave={handleUpdate}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditPost;
