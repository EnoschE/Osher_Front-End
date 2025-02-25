import PageLayout from "../PageLayout/PageLayout";
import TableBlock from "../Common/Table/TableBlock";
import { useSelector } from "../../Redux/reduxHooks";
import { selectCategories } from "../../Redux/Slices/categoriesSlice";
import { Box } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";

const Categories = () => {
  const cats = useSelector(selectCategories);

  const tableHeaders = [
    {
      text: "ID",
      key: "_id",
      // showEllipses: true,
      // maxWidth: 120,
      sortable: true,
    },
    { text: "Category name", key: "name", sortable: true },
    {
      text: "Color",
      key: "color",
      customComponent: (props: any) => (
        <Box
          bgcolor={props.color + "20"}
          borderRadius={borderRadius.xs}
          color={props.color}
          border={`1px solid ${props.color}`}
          padding={"4px 12px"}
          display='inline'
          boxShadow={`0px 2px 12px ${props.color + "60"}`}
        >
          {props.name}
        </Box>
      ),
    },
  ];

  return (
    <PageLayout hideBackButton>
      <TableBlock
        heading='Categories'
        subHeading='These are all the categories'
        tableData={cats}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no categories present.'
        rowsPerPage={10}
      />
    </PageLayout>
  );
};

export default Categories;
