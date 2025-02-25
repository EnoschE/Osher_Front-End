import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";

import { toast } from "react-toastify";
import {
  deleteCustomer,
  getCustomerDetails,
  getTechnicianCustomers,
} from "../../Services/dashboardService";
import {
  customerTableHeaders,
  downloadPDFFiles,
} from "../Installers/Representatives/RepresentativeDetails";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { isSuperAdminLoggedIn } from "../../Services/userService";
import UnassignTechnicianDialog from "../Technicians/UnassignTechnicianDialog";
import { deleteBrand, getBrandById } from "../../Services/brandsService";

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [unassignCustomer, setUnassignCustomer] = useState<{
    text: string;
    id: string;
  } | null>(null);
  const [projects, setProjects] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async (onlyGetProject?: boolean) => {
    if (!id) navigate(allRoutes.BRANDS);

    setLoading(!onlyGetProject);
    try {
      const data = await getBrandById((id || "")?.toString());
      setData(data);

      // const { data: assignedCustomers } = await getTechnicianCustomers(
      //   (userData?._id || "")?.toString()
      // );
      // setProjects(assignedCustomers || []);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const openDeleteDialog = () => setDeleteDialog(true);
  const closeDeleteDialog = () => setDeleteDialog(false);

  const openUnassignDialog = (props: { text: string; id: string }) =>
    setUnassignCustomer(props);
  const closeUnassignDialog = () => setUnassignCustomer(null);

  const handleEdit = () =>
    navigate(allRoutes.EDIT_BRAND.replace(":id", (id || "")?.toString()));

  const handleDelete = async () => {
    try {
      const data: any = await deleteBrand(id || "");

      if (data === "Brand deleted successfully!") {
        toast.success(data);
        navigate(allRoutes.BRANDS);
      }
    } catch (error: any) {
      toast.error(error);
      if (error === "Brand with the given id was not found")
        navigate(allRoutes.BRANDS);
    }
  };

  const fields = [
    { text: "Name", key: "name" },
    { text: "Email", key: "email" },
    { text: "Address", key: "address" },
    { text: "Phone Number", key: "phone" },
  ];

  const headers = [
    ...customerTableHeaders.filter((item) => item.text !== "Report"),
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: any) => {
        const notReportsPresent =
          !props.fullObject?.summaryProposalPdfLink &&
          !props.fullObject?.billAnalysisPdfLink;
        return (
          <CustomTableOptions
            menuOptions={[
              {
                text: "Reassign",
                onClick: () => openUnassignDialog(props),
              },
              {
                text: "Download Report",
                onClick: () => {
                  if (!notReportsPresent) {
                    downloadPDFFiles([
                      props.fullObject?.summaryProposalPdfLink,
                      props.fullObject?.billAnalysisPdfLink,
                    ]);
                  }
                },
                disabled: notReportsPresent,
                tooltip: notReportsPresent
                  ? "Reports have not been generated for this customer"
                  : "Download Reports",
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <PageLayout loading={loading}>
      <ProfileHeader
        data={data}
        userType='Brand'
        handleEdit={handleEdit}
        handleDelete={openDeleteDialog}
        disableDeleteButton={!!projects?.length}
        hideButtons={!isSuperAdminLoggedIn()}
      />

      <Box
        display='grid'
        gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
        gap={{ xs: 10, md: 32 }}
        alignItems='center'
        mt={45}
      >
        {fields?.map((field) => (
          <React.Fragment key={field.key}>
            <Typography variant='h6'>{field.text}</Typography>
            <Typography>{data?.[field.key] || "Not given"}</Typography>
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ my: { xs: 16, md: 42 } }} />

      <TableBlock
        heading={"Brand's vouchers"}
        subHeading={`These are all the vouchers of ${data?.name}`}
        tableData={projects}
        tableHeaders={headers}
        emptyStateMessage={`There are no vouchers generated by ${data?.name}`}
        detailsPagePath={allRoutes.VIEW_CUSTOMER}
      />

      <DeleteDialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        userType='Brand'
        user={data}
        onDelete={handleDelete}
      />
      <UnassignTechnicianDialog
        // open
        open={!!unassignCustomer}
        unassignedCustomer={unassignCustomer}
        onClose={closeUnassignDialog}
        currentTechnician={data}
        onUnassign={() => getDetails(true)}
      />
    </PageLayout>
  );
};

export default AdDetails;
