import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Common/DeleteDialog";
import ProfileHeader from "../Common/ProfileHeader";
import { toast } from "react-toastify";
import {
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
import { useTranslation } from "react-i18next";

const InfluencerDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();

  const [data, setData] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ads, setAds] = useState<Array<any>>([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async (onlyGetProject?: boolean) => {
    if (!id)
      return navigate(isLoggedIn ? allRoutes.INFLUENCERS : allRoutes.FEED);

    setLoading(!onlyGetProject);
    try {
      const influencerDetails = await getInfluencerById((id || "")?.toString());
      setData(influencerDetails);

      const adsOfInfluencer: any = await getPostsOfInfluencer(id || "");
      setAds(adsOfInfluencer || []);
    } catch (error: any) {
      if (
        [
          "Invalid influencer id",
          "Influencer with the given id was not found",
        ].includes(error)
      )
        navigate(isLoggedIn ? allRoutes.INFLUENCERS : allRoutes.FEED);
      toast.error(t(error));
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
        toast.success(t(data));
        navigate(allRoutes.INFLUENCERS);
      }
    } catch (error: any) {
      toast.error(t(error));
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
    <PageLayout hideBackButton={!isLoggedIn} hideSidebar={!isLoggedIn}>
      <ProfileHeader
        data={data}
        userType='Influencer'
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={!isSuperAdminLoggedIn()}
        isLoading={loading}
      />

      <PageDetailsBlock
        data={data}
        fields={fields}
        showBottomDivider
        isLoading={loading}
      />

      <TableBlock
        heading={`${t("Posts of")} ${data?.name || t("Influencer")}`}
        subHeading={`${t("These are all the posts of")} ${
          data?.name || t("Influencer")
        }`}
        tableData={ads}
        tableHeaders={headers}
        emptyStateMessage={`${t("There are no posts by")} ${
          data?.name || "Influencer"
        }`}
        detailsPagePath={allRoutes.VIEW_POST}
        isLoading={loading}
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
