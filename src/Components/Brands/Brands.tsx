import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import { getAllTechnicians } from "../../Services/dashboardService";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  const tableHeaders = [
    { text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
    {
      text: "Name",
      key: "name",
      showEllipses: true,
      maxWidth: 100,
      sortable: true,
    },
    {
      text: "Email address",
      key: "email",
      showEllipses: true,
      maxWidth: 130,
      sortable: true,
    },
    { text: "Company", key: "company", showEllipses: true, maxWidth: 130 },
    { text: "Email Status", key: "isEmailVerified" },
    { text: "Calender Synced", key: "calendarSynced" },
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: { id: string; text: string }) => (
        <CustomTableOptions
          menuOptions={[
            {
              text: "Edit Brand",
              onClick: () => {
                navigate(allRoutes.EDIT_BRAND.replace(":id", props.id));
              },
            },
            // {
            //   text: "Change Status",
            //   onClick: () => {
            //     navigate(
            //       allRoutes.UPDATE_STATUS.replace(":id", props.id)
            //     );
            //   },
            // },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getAllTechnicians();
      setData(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <PageLayout loading={loading} hideBackButton>
      <TableBlock
        heading='Brands'
        subHeading='These are all the brands'
        tableData={data}
        addButtonText='Add Brand'
        addButtonPath={allRoutes.ADD_BRAND}
        detailsPagePath={allRoutes.VIEW_BRAND}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no brands present. Please add a brand.'
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Brands;
