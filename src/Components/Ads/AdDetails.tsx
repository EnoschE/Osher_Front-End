import { deleteAd, getAdById } from "../../Services/adsService";
import { allRoutes } from "../../Routes/AllRoutes";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/Slices/userSlice";
import {
  isBrandLoggedIn,
  isSuperAdminLoggedIn,
} from "../../Services/userService";
import AvatarWithName from "../Common/AvatarWithName";
import { PageDetailsField } from "../../Utils/types";
import { useNavigate } from "react-router-dom";
import EntityDetailsPage from "../ReusablePages/EntityDetailsPage";
import { adTypes } from "../../Utils/enums";

const AdDetails = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isBrand = isBrandLoggedIn();
  const isAdmin = isSuperAdminLoggedIn();

  const fields: PageDetailsField[] = [
    { text: "Name", key: "name" },
    { text: "Description", key: "description" },
    { text: "Category", key: "categoryName" },
    {
      text: "Brand",
      key: "brandName",
      customComponent: (props: any) => (
        <AvatarWithName
          name={props?.brandName}
          picture={props?.brandPicture}
          onClick={() =>
            isBrand && props?.brandId === user?._id
              ? navigate(allRoutes.MY_PROFILE)
              : navigate(
                  allRoutes.VIEW_BRAND.replace(":id", props.brandId || "")
                )
          }
        />
      ),
    },

    ...(isAdmin || isBrand
      ? [
          { text: "Views", key: "views" },
          { text: "Time Slots", key: "timeSlots" },
          { text: "Days", key: "days" },
          { text: "States", key: "states" },
          {
            text: "Ad Type",
            key: "adType",
            customComponent: (props: { adType: string }) =>
              Object.values(adTypes).find((type) => type.value === props.adType)
                ?.name,
          },
        ]
      : []),
    { text: "Publish Date", key: "publishDate", type: "date" },

    ...(isAdmin || isBrand
      ? ([
          {
            text: "Expiry Date",
            key: "expiryDate",
            type: "date",
          },
        ] as PageDetailsField[])
      : []),
  ];

  return (
    <EntityDetailsPage
      entityType='Ad'
      getDetailsFn={getAdById}
      deleteFn={deleteAd}
      fields={fields}
      editRoute={allRoutes.EDIT_AD}
      backRoute={allRoutes.ADS}
      checkEditAccess={(data) => isBrand && data?.brandId === user?._id}
    />
  );
};

export default AdDetails;
