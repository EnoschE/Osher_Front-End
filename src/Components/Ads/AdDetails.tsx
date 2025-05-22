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

    { text: "Publish Date", key: "publishDate", type: "date" },
    ...(isAdmin || isBrand
      ? [
          { text: "Views", key: "views" },
          { text: "Time Slots", key: "timeSlots" },
          { text: "Days", key: "days" },
          { text: "States", key: "states" },
        ]
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
