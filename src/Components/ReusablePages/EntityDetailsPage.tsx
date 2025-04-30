import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { PageDetailsField, UserRoleType } from "../../Utils/types";
import ProfileHeader from "../Common/ProfileHeader";
import PageDetailsBlock, {
  commonDetailsPageFields,
} from "../Common/PageDetailsBlock";
import DeleteDialog from "../Common/DeleteDialog";
import {
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../../Services/userService";
import { useTranslation } from "react-i18next";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";

interface EntityDetailsPageProps {
  entityType: UserRoleType;
  getDetailsFn?: (id: string) => Promise<any>;
  deleteFn?: (id: string) => Promise<any>;
  fields?: PageDetailsField[];
  editRoute: string;
  backRoute?: string;
  checkEditAccess?: (props: any) => boolean;
  isMyProfilePage?: boolean;
  getExtraSectionData?: (prop: any) => {
    getItemsFn: (id: string) => Promise<any>;
    heading: string;
    subHeading: string;
    headers: Array<any>;
    emptyStateMessage: string;
    detailsPagePath: string;
  };
}

const EntityDetailsPage = ({
  entityType,
  getDetailsFn,
  deleteFn,
  fields,
  editRoute,
  backRoute,
  checkEditAccess,
  isMyProfilePage,
  getExtraSectionData,
}: EntityDetailsPageProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isLoggedIn = isUserLoggedIn();
  const user = useSelector(selectUser);
  const dependency = isMyProfilePage ? user : null;

  const [data, setData] = useState<any>({});
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const extraSectionData = getExtraSectionData?.(data);

  useEffect(() => {
    getDetails();
  }, [dependency]);

  const getDetails = async () => {
    // TODO: Important if influencer logged in, and he opens the influencerDetails page with his id it should take him to MYPROFILE page, same for brand etc

    if (isMyProfilePage) {
      if (!user._id) return;
    } else {
      if (!id && backRoute)
        return navigate(isLoggedIn ? backRoute : allRoutes.FEED);
    }

    setLoading(true);
    try {
      if (isMyProfilePage) {
        if (user && !data._id) setData(user);
      } else {
        const response = await getDetailsFn?.(id || "");
        setData(response);
      }

      if (!!extraSectionData) {
        const userId = (isMyProfilePage ? user?._id : id) || "";
        const itemsResponse: any = await extraSectionData?.getItemsFn(userId);
        setItems(itemsResponse || []);
      }
    } catch (err: any) {
      toast.error(t(err));
      if (!isMyProfilePage && backRoute) {
        if (err.includes("not available") || err.includes("id was not found"))
          navigate(isLoggedIn ? backRoute : allRoutes.FEED);
        else navigate(backRoute);
      }
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const handleEdit = () => navigate(editRoute.replace(":id", id || ""));

  const handleDelete = async () => {
    if (!deleteFn) return;

    try {
      const result = await deleteFn(id || "");
      if (result?.includes("successfully")) {
        toast.success(t(result));
        if (backRoute) navigate(backRoute);
      }
    } catch (err: any) {
      toast.error(t(err));
      if (backRoute) navigate(backRoute);
    }
  };

  const detailsBlockFields = fields || commonDetailsPageFields;

  const canEditOrDelete = isMyProfilePage
    ? true
    : isSuperAdmin || !!checkEditAccess?.(data);

  return (
    <PageLayout hideSidebar={!isLoggedIn} hideBackButton={!isLoggedIn}>
      <ProfileHeader
        isSquarish={["Post", "Ad"].includes(entityType)}
        data={data}
        userType={entityType}
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        hideButtons={!canEditOrDelete}
        isLoading={loading}
        hideDeleteButton={!deleteFn}
      />

      <PageDetailsBlock
        data={data}
        fields={detailsBlockFields}
        isLoading={loading}
        showBottomDivider={!!extraSectionData}
      />

      {!!extraSectionData && (
        <TableBlock
          heading={extraSectionData.heading}
          subHeading={extraSectionData.subHeading}
          tableData={items}
          tableHeaders={extraSectionData.headers}
          emptyStateMessage={extraSectionData.emptyStateMessage}
          detailsPagePath={extraSectionData.detailsPagePath}
          isLoading={loading}
        />
      )}

      {!isMyProfilePage && (
        <DeleteDialog
          open={deleteDialog}
          onClose={closeDeleteDialog}
          userType={entityType}
          user={data}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
};

export default EntityDetailsPage;
