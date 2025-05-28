import PageLayout from "../PageLayout/PageLayout";
import { allRoutes } from "../../Routes/AllRoutes";
import TableBlock from "../Common/Table/TableBlock";
import CustomTableOptions from "../Common/CustomTableOptions";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "../../Services/brandsService";
import AvatarWithName from "../Common/AvatarWithName";

const Brands = () => {
  const navigate = useNavigate();

  const tableHeaders = [
    {
      text: "Brand",
      key: "name",
      customComponent: (props: { picture: string; name: string }) => (
        <AvatarWithName picture={props.picture} name={props.name} />
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
      text: "Ads",
      key: "ads",
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

  return (
    <PageLayout hideBackButton>
      <TableBlock
        getDataFn={getAllBrands}
        heading='Brands'
        subHeading='These are all the brands'
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
