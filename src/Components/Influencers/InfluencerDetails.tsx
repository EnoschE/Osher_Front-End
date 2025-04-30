import { allRoutes } from "../../Routes/AllRoutes";
import EntityDetailsPage from "../ReusablePages/EntityDetailsPage";
import { useTranslation } from "react-i18next";
import {
  deleteInfluencer,
  getInfluencerById,
} from "../../Services/influencersService";
import { getPostsOfInfluencer } from "../../Services/postsService";
import { commonPostsTableHeaders } from "../Posts/Posts";

const InfluencerDetails = () => {
  const { t } = useTranslation();

  return (
    <EntityDetailsPage
      entityType='Influencer'
      getDetailsFn={getInfluencerById}
      deleteFn={deleteInfluencer}
      editRoute={allRoutes.EDIT_INFLUENCER}
      backRoute={allRoutes.INFLUENCERS}
      getExtraSectionData={(data: any) => ({
        getItemsFn: getPostsOfInfluencer,
        headers: commonPostsTableHeaders,
        detailsPagePath: allRoutes.VIEW_POST,
        heading: `${t("Posts of")} ${data?.name || t("Influencer")}`,
        subHeading: `${t("These are all the posts of")} ${
          data?.name || t("Influencer")
        }`,
        emptyStateMessage: `${t("There are no posts by")} ${
          data?.name || "Influencer"
        }`,
      })}
    />
  );
};

export default InfluencerDetails;
