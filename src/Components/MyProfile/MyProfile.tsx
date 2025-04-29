import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import ProfileHeader from "../Common/ProfileHeader";
import { toast } from "react-toastify";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
} from "../../Services/userService";
import PageDetailsBlock from "../Common/PageDetailsBlock";
import TableBlock from "../Common/Table/TableBlock";
import { getPostsOfInfluencer } from "../../Services/postsService";
import { commonPostsTableHeaders } from "../Posts/Posts";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { getAdsOfBrand } from "../../Services/adsService";
import { commonAdsTableHeaders } from "../Ads/Ads";
import { useTranslation } from "react-i18next";

const MyProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    getDetails();
  }, [user]);

  const getDetails = async (onlyGetProject?: boolean) => {
    if (!user) return;

    setLoading(!onlyGetProject);
    try {
      if (user && !data._id) setData(user);

      if (user._id && (isInfluencer || isBrand)) {
        const userItems: any = await (isBrand
          ? getAdsOfBrand(user._id)
          : getPostsOfInfluencer(user._id || ""));
        setItems(userItems || []);
      }
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleEdit = () => navigate(allRoutes.ACCOUNT_SETTINGS);

  const fields = [
    { text: "Name", key: "name" },
    { text: "Email", key: "email" },
    { text: "Address", key: "address" },
    { text: "Phone Number", key: "phone" },
  ];

  const headers = isBrand ? commonAdsTableHeaders : commonPostsTableHeaders;

  return (
    <PageLayout hideBackButton>
      <ProfileHeader
        data={data}
        userType={isBrand ? "Brand" : isInfluencer ? "Influencer" : "Admin"}
        handleEdit={handleEdit}
        hideDeleteButton
        isLoading={loading}
      />

      <PageDetailsBlock
        data={data}
        fields={fields}
        showBottomDivider={isInfluencer || isBrand}
        isLoading={loading}
      />

      {(isBrand || isInfluencer) && (
        <TableBlock
          heading={`${t("My")} ${isBrand ? t("Ads") : t("Posts")}`}
          subHeading={`${t("These are all my")} ${
            isBrand ? t("ads") : t("posts")
          }`}
          tableData={items}
          tableHeaders={headers}
          emptyStateMessage={`${t("There are no")} ${
            isBrand ? t("ads") : t("posts")
          } ${t("by me")}`}
          detailsPagePath={isBrand ? allRoutes.VIEW_AD : allRoutes.VIEW_POST}
          isLoading={loading}
        />
      )}
    </PageLayout>
  );
};

export default MyProfile;
