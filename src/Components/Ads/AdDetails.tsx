import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";
import { toast } from "react-toastify";
import { isSuperAdminLoggedIn } from "../../Services/userService";
import { deleteAd, getAdById } from "../../Services/adsService";
import PageDetailsBlock from "../Common/PageDetailsBlock";
import { PageDetailsField } from "../../Utils/types";
import AvatarWithName from "../Common/AvatarWithName";
import moment from "moment";

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.ADS);

    setLoading(true);
    try {
      const data = await getAdById((id || "")?.toString());
      setData(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const handleEdit = () =>
    navigate(allRoutes.EDIT_AD.replace(":id", (id || "")?.toString()));

  const handleDelete = async () => {
    try {
      const data: any = await deleteAd(id || "");

      if (data === "Ad deleted successfully!") {
        toast.success(data);
        navigate(allRoutes.ADS);
      }
    } catch (error: any) {
      toast.error(error);
      if (error === "Ad with the given id was not found")
        navigate(allRoutes.ADS);
    }
  };

  const fields: PageDetailsField[] = [
    { text: "Name", key: "name" },
    { text: "Category", key: "categoryName" },
    {
      text: "Brand",
      key: "brandName",
      customComponent: (
        <AvatarWithName
          name={data?.brandName}
          picture={data?.brandPicture}
          onClick={() =>
            navigate(allRoutes.VIEW_BRAND.replace(":id", data.brandId))
          }
        />
      ),
    },
    { text: "Publish Date", key: "publishDate", type: "date" },
    { text: "Expiry Date", key: "expiryDate", type: "date" },
  ];

  return (
    <PageLayout loading={loading}>
      <ProfileHeader
        data={data}
        userType='Ad'
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={!isSuperAdminLoggedIn()}
      />

      <PageDetailsBlock data={data} fields={fields} />

      <DeleteDialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        userType='Ad'
        user={data}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
};

export default AdDetails;
