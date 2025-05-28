import { allRoutes } from "../../Routes/AllRoutes";
import EntityDetailsPage from "../ReusablePages/EntityDetailsPage";
import { commonAdsTableHeaders } from "../Ads/Ads";
import { useTranslation } from "react-i18next";
import { getAdsOfBrand } from "../../Services/adsService";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
} from "../../Services/userService";
import { getPostsOfInfluencer } from "../../Services/postsService";
import { commonPostsTableHeaders } from "../Posts/Posts";

const MyProfile = () => {
  const { t } = useTranslation();
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();

  return (
    <EntityDetailsPage
      isMyProfilePage
      entityType={isBrand ? "Brand" : isInfluencer ? "Influencer" : "Admin"}
      editRoute={allRoutes.ACCOUNT_SETTINGS}
      getExtraSectionData={
        !(isBrand || isInfluencer)
          ? undefined
          : () => ({
              getItemsFn: isBrand ? getAdsOfBrand : getPostsOfInfluencer,
              headers: isBrand
                ? commonAdsTableHeaders
                : commonPostsTableHeaders,
              heading: `${t("My")} ${isBrand ? t("Ads") : t("Posts")}`,
              subHeading: `${t("These are all my")} ${
                isBrand ? t("ads") : t("posts")
              }`,
              emptyStateMessage: `${t("There are no")} ${
                isBrand ? t("ads") : t("posts")
              } ${t("by me")}`,
              detailsPagePath: isBrand
                ? allRoutes.VIEW_AD
                : allRoutes.VIEW_POST,
            })
      }
    />
  );
};

export default MyProfile;
