import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";
import { toast } from "react-toastify";
import {
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../../Services/userService";
import PageDetailsBlock from "../Common/PageDetailsBlock";
import { PageDetailsField } from "../../Utils/types";
import AvatarWithName from "../Common/AvatarWithName";
import { deletePost, getPostById } from "../../Services/postsService";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isInfluencer = isInfluencerLoggedIn();
  const user = useSelector(selectUser);
  const isLoggedIn = isUserLoggedIn();

  const [data, setData] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.POSTS);

    setLoading(true);
    try {
      const data = await getPostById((id || "")?.toString());
      setData(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const handleEdit = () =>
    navigate(allRoutes.EDIT_POST.replace(":id", (id || "")?.toString()));

  const handleDelete = async () => {
    try {
      const data: any = await deletePost(id || "");

      if (data === "Post deleted successfully!") {
        toast.success(data);
        navigate(allRoutes.POSTS);
      }
    } catch (error: any) {
      toast.error(error);
      if (error === "Post with the given id was not found")
        navigate(allRoutes.POSTS);
    }
  };

  const fields: PageDetailsField[] = [
    { text: "Name", key: "name" },
    { text: "Description", key: "description" },
    {
      text: "Influencer",
      key: "userName",
      customComponent: (
        <AvatarWithName
          name={data?.userName}
          picture={data?.userPicture}
          onClick={() =>
            isInfluencer && data?.userId === user?._id
              ? navigate(allRoutes.MY_PROFILE)
              : navigate(allRoutes.VIEW_INFLUENCER.replace(":id", data.userId))
          }
        />
      ),
    },
    { text: "Publish Date", key: "publishDate", type: "date" },
  ];

  return (
    <PageLayout hideBackButton={!isLoggedIn} hideSidebar={!isLoggedIn}>
      <ProfileHeader
        isSquarish
        data={data}
        userType='Post'
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={
          !(
            isSuperAdminLoggedIn() ||
            (isInfluencer && data?.userId === user?._id)
          )
        }
        isLoading={loading}
      />

      <PageDetailsBlock data={data} fields={fields} isLoading={loading} />

      <DeleteDialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        userType='Post'
        user={data}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
};

export default PostDetails;
