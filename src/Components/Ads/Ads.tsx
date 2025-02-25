import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "../../Services/brandsService";
import CustomAvatar from "../Common/CustomAvatar";
import { Box, Typography } from "@mui/material";

const Ads = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  const tableHeaders = [
    {
      text: "Brand",
      key: "name",
      customComponent: (props: { picture: string; name: string }) => (
        <Box display='flex' alignItems='center' gap={8}>
          <CustomAvatar src={props.picture} />
          <Typography>{props.name}</Typography>
        </Box>
      ),
    },
    {
      text: "Email address",
      key: "email",
      showEllipses: true,
      maxWidth: 130,
      sortable: true,
    },
    {
      text: "Address",
      key: "address",
      showEllipses: true,
      maxWidth: 130,
      sortable: true,
    },
    {
      text: "Phone",
      key: "phone",
      sortable: true,
    },
    {
      text: "",
      key: "name",
      align: "right",
      notClickable: true,
      customComponent: (props: { _id: string }) => (
        <CustomTableOptions
          menuOptions={[
            {
              text: "Edit Brand",
              onClick: () => {
                navigate(allRoutes.EDIT_BRAND.replace(":id", props._id));
              },
            },
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
      const data: any = await getAllBrands();
      setData(data);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <PageLayout loading={loading} hideBackButton>
      <TableBlock
        heading='Ads'
        subHeading='These are all the ads'
        tableData={data}
        addButtonText='Add ad'
        addButtonPath={allRoutes.ADD_BRAND}
        detailsPagePath={allRoutes.VIEW_BRAND}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no ads present. Please add a ad.'
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Ads;
