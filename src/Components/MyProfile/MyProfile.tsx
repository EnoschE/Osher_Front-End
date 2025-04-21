import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import ProfileHeader from "../Admins/ProfileHeader";
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

const MyProfile = () => {
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
      toast.error(error);
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

  const headers = commonPostsTableHeaders;

  return (
    <PageLayout loading={loading} hideBackButton>
      <ProfileHeader
        data={data}
        userType={isBrand ? "Brand" : isInfluencer ? "Influencer" : "Admin"}
        handleEdit={handleEdit}
        hideDeleteButton
      />

      <PageDetailsBlock
        data={data}
        fields={fields}
        showBottomDivider={isInfluencer || isBrand}
      />

      {(isBrand || isInfluencer) && (
        <TableBlock
          heading={`${isBrand ? "Ads" : "Posts"} of ${
            data?.name || (isBrand ? "Brand" : "Influencer")
          }`}
          subHeading={`These are all the ${
            isBrand ? "ads" : "posts"
          } of ${data?.name}`}
          tableData={items}
          tableHeaders={headers}
          emptyStateMessage={`There are no ${
            isBrand ? "ads" : "posts"
          } by ${data?.name}`}
          detailsPagePath={isBrand ? allRoutes.VIEW_AD : allRoutes.VIEW_POST}
        />
      )}
    </PageLayout>
  );
};

export default MyProfile;
