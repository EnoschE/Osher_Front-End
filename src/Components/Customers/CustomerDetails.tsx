import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import { Box, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import DeleteDialog from "../Customers/DeleteDialog";
import ProfileHeader from "../Admins/ProfileHeader";
import StatusChip from "../Common/StatusChip";
import { toast } from "react-toastify";
import {
  deleteCustomer,
  getAssignedInstaller,
  getAssignedTechnician,
  getCustomerAccessToken,
  getCustomerDetails,
  getCustomerInstallerDetails,
} from "../../Services/dashboardService";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { borderRadius } from "../../Utils/spacings";
import CustomButton from "../Common/CustomButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { isSuperAdminLoggedIn } from "../../Services/userService";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { formatDate } from "../../Utils/utils";

const CustomerDetails = () => {
  const colors = useSelector(selectColors);
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isSuperAdmin = isSuperAdminLoggedIn();

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    if (!id) navigate(allRoutes.CUSTOMERS);

    setLoading(true);
    try {
      const { data: userData } = await getCustomerDetails(
        (id || "")?.toString()
      );

      const [
        { data: installer },
        { data: technician },
        { data: installerDetails },
      ] = await Promise.all([
        getAssignedInstaller((userData?._id || "")?.toString()),
        getAssignedTechnician((userData?._id || "")?.toString()),
        getCustomerInstallerDetails((userData?._id || "")?.toString()),
      ]);

      userData.technician = technician?.name;
      userData.installer = installer?.name;
      if (installerDetails) {
        const { installerId, managerId, officeManagerId, installerCompanyId } =
          installerDetails;
        if (installerId) userData.representative = installerId;
        if (managerId) userData.manager = managerId;
        if (officeManagerId) userData.officeManager = officeManagerId;
        if (installerCompanyId) userData.installerCompany = installerCompanyId;
      }
      console.log({ userData });
      setData(userData);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const openDialog = () => setOpenDeleteDialog(true);
  const closeDialog = () => setOpenDeleteDialog(false);

  const handleEdit = () =>
    navigate(allRoutes.EDIT_CUSTOMER.replace(":id", (id || "")?.toString()));

  const handleDelete = async () => {
    try {
      const { data: res } = await deleteCustomer(data?._id || "");
      if (res === "Account deleted") {
        toast.success("Customer deleted successfully!");
        navigate(allRoutes.CUSTOMERS);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  async function redirectToUserDashboard() {
    try {
      console.log("Redirecting to user dashboard");
      const {
        data: { link },
      } = await getCustomerAccessToken({ customerId: data._id });
      if (!link) throw new Error("Link not found");
      window.open(link, "_blank");
    } catch (error: any) {
      toast.error(error);
    }
  }

  const fields = [
    { text: "Lead Status", key: "leadStatus", errorMessage: "Not set" },
    { text: "First Name", key: "name" },
    { text: "Last Name", key: "lastName" },
    { text: "Email address", key: "email" },
    { text: "Address", key: "address" },
    { text: "Monthly Bill", key: "bill" },
    { text: "Phone Number", key: "phone" },
    {
      text: "Installation Crew",
      key: "technician",
      errorMessage: "Not assigned",
    },

    customTooltipComponent("Installer Company", "installerCompany"),
    customTooltipComponent("Office Manager", "officeManager"),
    customTooltipComponent("Manager", "manager"),
    customTooltipComponent("Representative", "representative"),

    ...(data.electricity_bill
      ? [
          {
            text: "Supply Charges",
            key: "supplyCharges",
            errorMessage: "Not Found",
          },
          {
            text: "Delivery Charges",
            key: "deliveryCharges",
            errorMessage: "Not Found",
          },
          {
            text: "Uploaded Bill Cost",
            key: "uploadedBillCost",
            errorMessage: "Not Found",
          },
          {
            text: "Monthly Electricity Usage",
            key: "monthlyElectricityUsage",
            subValues:
              data.monthlyElectricityUsage &&
              Object.keys(data.monthlyElectricityUsage).map((key) => ({
                label: key,
                value: data.monthlyElectricityUsage[key],
              })),
          },
        ]
      : []),

    ...(data.sequentialId
      ? [
          {
            text: "View Logs",
            key: "status",
            customComponent: () => (
              <CustomButton
                onClick={() =>
                  navigate(
                    allRoutes.LOGS.replace(
                      ":id",
                      (data.sequentialId || "")?.toString()
                    )
                  )
                }
                variant='text'
                sx={{ padding: 5, minWidth: "unset" }}
              >
                <MessageOutlinedIcon />
              </CustomButton>
            ),
          },
        ]
      : []),

    ...(isSuperAdmin
      ? [
          {
            text: "View Project",
            key: "status",
            customComponent: () => (
              <CustomButton
                onClick={() => redirectToUserDashboard()}
                variant='text'
                sx={{ padding: 5, minWidth: "unset" }}
              >
                <OpenInNewIcon />
              </CustomButton>
            ),
          },
        ]
      : []),
  ];
  console.log(fields);

  return (
    <PageLayout loading={loading}>
      <ProfileHeader
        data={data}
        userType='Customer'
        handleEdit={handleEdit}
        handleDelete={openDialog}
      />

      <Box
        display='grid'
        gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
        gap={{ xs: 10, md: 32 }}
        alignItems='start'
        justifyItems='flex-start'
        mt={45}
      >
        <Typography variant='h6' mt={{ xs: 12, md: 0 }}>
          Project Step
        </Typography>
        <Box
          display='flex'
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={10}
          justifyContent='flex-start'
          flexDirection={{ xs: "column", md: "row" }}
          sx={{
            bgcolor: colors.primary + "09",
            border: `1.5px dotted ${colors.primary}`,
            padding: 16,
            borderRadius: borderRadius.md,
            width: "100%",
          }}
        >
          <Box display='flex' flexDirection={"column"}>
            <Box display='flex' gap={10} alignItems='center'>
              <Typography fontSize={16} color='primary' fontWeight={600}>
                {data.currentStep}
              </Typography>
              <StatusChip status={data.status} />
            </Box>

            {data.siteSchedule && (
              <Typography fontSize={12} color='primary' fontWeight={600}>
                Site Survey: {formatDate(data.siteSchedule.date)},{" "}
                {data.siteSchedule.time}
              </Typography>
            )}
          </Box>
          <CustomButton
            variant='outlined'
            sx={{ py: 8, px: 14, ml: { xs: "unset", md: "auto" } }}
            onClick={() =>
              navigate(allRoutes.UPDATE_STATUS?.replace(":id", id || ""))
            }
          >
            Change Status
          </CustomButton>
        </Box>
        {fields?.map((field) => (
          <React.Fragment key={field.key}>
            <Typography variant='h6'>{field.text}</Typography>
            {field.customComponent ? (
              field.customComponent({ text: data?.[field.key] })
            ) : field.subValues ? (
              <Box
                display='grid'
                alignItems='flex-start'
                gridTemplateColumns={{ xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }}
                gap={{ xs: 10, md: 32 }}
                sx={{
                  padding: 16,
                  bgcolor: colors.primary + "09",
                  border: `1.5px dotted ${colors.primary}`,
                  borderRadius: borderRadius.md, // TODO for Waleed: create a common component for this purpleBox and use it in all places e.g, AccountSettings, ConfigurationsPage, EditCustomer, CustomerDetails
                  minWidth: { sm: "auto", xs: "100%" },
                }}
              >
                {field.subValues?.map((subField: any) => (
                  <Box key={subField.label}>
                    <Typography fontSize={12} fontWeight={600} mb={3}>
                      {subField.label}
                    </Typography>
                    <Typography>{subField.value}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>
                {data?.[field.key] || field.errorMessage || "Not given"}
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>

      <DeleteDialog
        open={openDeleteDialog}
        onClose={closeDialog}
        userType='Customer'
        onDelete={handleDelete}
        user={data}
      />
    </PageLayout>
  );
};

export default CustomerDetails;

const customTooltipComponent = (titleText: string, key: string) => {
  const colors = {};
  // const colors = useSelector(selectColors);

  return {
    text: titleText,
    key: key, // Use the dynamically generated key
    errorMessage: "Not assigned",
    customComponent: ({ text: entityInfo }: any) => {
      console.log({ [key]: entityInfo }); // Log using the dynamic key
      return (
        <>
          {entityInfo ? (
            <Tooltip
              arrow
              placement='bottom-end'
              enterTouchDelay={0}
              leaveTouchDelay={3500}
              title={
                <Box
                  sx={{
                    minWidth: "250px",
                    p: "10px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <Typography
                    fontSize={12}
                    // color='text.secondary'
                    mb={10}
                    textAlign='center'
                  >
                    {titleText}
                  </Typography>
                  <Typography>
                    <b>First Name:</b> {entityInfo.name || "-"}
                  </Typography>
                  <Typography>
                    <b>Last Name:</b> {entityInfo.lastName || "-"}
                  </Typography>
                  <Typography>
                    <b>Email:</b> {entityInfo.email || "-"}
                  </Typography>
                  <Typography>
                    <b>Phone:</b> {entityInfo.phone_no || "-"}
                  </Typography>
                </Box>
              }
            >
              <Typography variant='inherit'>{entityInfo.name}</Typography>
            </Tooltip>
          ) : (
            "Not Assigned"
          )}
        </>
      );
    },
  };
};
