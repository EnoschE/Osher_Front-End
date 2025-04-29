import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { PageDetailsField, UserRoleType } from "../../Utils/types";
import ProfileHeader from "../Common/ProfileHeader";
import PageDetailsBlock from "../Common/PageDetailsBlock";
import DeleteDialog from "../Common/DeleteDialog";
import {
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../../Services/userService";
import { useTranslation } from "react-i18next";
import { allRoutes } from "../../Routes/AllRoutes";

interface EntityDetailsPageProps {
  entityType: UserRoleType;
  getDetailsFn: (id: string) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
  fields: PageDetailsField[];
  editRoute: string;
  backRoute: string;
  checkEditAccess: (props: any) => boolean;
  hideSidebar?: boolean;
  hideBackButton?: boolean;
  extraSection?: React.ReactNode;
}

const EntityDetailsPage = ({
  entityType,
  getDetailsFn,
  deleteFn,
  fields,
  editRoute,
  backRoute,
  checkEditAccess,
  hideSidebar = false,
  hideBackButton = false,
  extraSection,
}: EntityDetailsPageProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isLoggedIn = isUserLoggedIn();

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    // if (!id) return navigate(backRoute);
    if (!id) return navigate(isLoggedIn ? backRoute : allRoutes.FEED);

    setLoading(true);
    try {
      const data = await getDetailsFn(id);
      setData(data);
    } catch (err: any) {
      toast.error(err);
      if (err.includes("not available") || err.includes("id was not found"))
        navigate(isLoggedIn ? backRoute : allRoutes.FEED);
      // navigate(backRoute);
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const handleEdit = () => navigate(editRoute.replace(":id", id || ""));

  const handleDelete = async () => {
    try {
      const result = await deleteFn(id || "");
      if (result?.includes("successfully")) {
        toast.success(t(result));
        navigate(backRoute);
      }
    } catch (err: any) {
      toast.error(t(err));
      navigate(backRoute);
    }
  };

  const canEditOrDelete = isSuperAdmin || checkEditAccess(data);

  return (
    <PageLayout hideSidebar={hideSidebar} hideBackButton={hideBackButton}>
      <ProfileHeader
        isSquarish
        data={data}
        userType={entityType}
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={!canEditOrDelete}
        isLoading={loading}
      />

      <PageDetailsBlock data={data} fields={fields} isLoading={loading} />

      {extraSection}

      <DeleteDialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        userType={entityType}
        user={data}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
};

export default EntityDetailsPage;
