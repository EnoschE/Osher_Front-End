import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";
import { toast } from "react-toastify";
import {
  isBrandLoggedIn,
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../../Services/userService";
import PageDetailsBlock from "../Common/PageDetailsBlock";
import {
  getInfluencerById,
  deleteInfluencer,
} from "../../Services/influencersService";
import TableBlock from "../Common/Table/TableBlock";
import { getPostsOfInfluencer } from "../../Services/postsService";
import { commonPostsTableHeaders } from "../Posts/Posts";

const InfluencerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isBrand = isBrandLoggedIn();
  const isLoggedIn = isUserLoggedIn();

  const [data, setData] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ads, setAds] = useState<Array<any>>([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async (onlyGetProject?: boolean) => {
    if (!id) navigate(allRoutes.INFLUENCERS);

    setLoading(!onlyGetProject);
    try {
      const influencerDetails = await getInfluencerById((id || "")?.toString());
      setData(influencerDetails);

      const adsOfInfluencer: any = await getPostsOfInfluencer(id || "");
      setAds(adsOfInfluencer || []);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const handleEdit = () =>
    navigate(allRoutes.EDIT_INFLUENCER.replace(":id", (id || "")?.toString()));

  const handleDelete = async () => {
    try {
      const data: any = await deleteInfluencer(id || "");

      if (data === "Influencer deleted successfully!") {
        toast.success(data);
        navigate(allRoutes.INFLUENCERS);
      }
    } catch (error: any) {
      toast.error(error);
      if (error === "Influencer with the given id was not found")
        navigate(allRoutes.INFLUENCERS);
    }
  };

  const fields = [
    { text: "Name", key: "name" },
    { text: "Email", key: "email" },
    { text: "Address", key: "address" },
    { text: "Phone Number", key: "phone" },
  ];

  const headers = commonPostsTableHeaders;

  return (
    <PageLayout
      loading={loading}
      hideBackButton={!isLoggedIn}
      hideSidebar={!isLoggedIn}
    >
      <ProfileHeader
        data={data}
        userType='Influencer'
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        // disableDeleteButton={!!ads?.length}
        hideButtons={!isSuperAdminLoggedIn()}
      />

      <PageDetailsBlock data={data} fields={fields} showBottomDivider />

      <TableBlock
        heading={`Posts of ${data?.name || "Influencer"}`}
        subHeading={`These are all the posts of ${data?.name}`}
        tableData={ads}
        tableHeaders={headers}
        emptyStateMessage={`There are no posts by ${data?.name}`}
        detailsPagePath={allRoutes.VIEW_POST}
      />

      <DeleteDialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        userType='Influencer'
        user={data}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
};

export default InfluencerDetails;
