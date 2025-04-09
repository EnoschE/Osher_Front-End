import PageLayout from "../PageLayout/PageLayout";
import TableBlock from "../Common/Table/TableBlock";
import { useSelector } from "../../Redux/reduxHooks";
import { selectCategories } from "../../Redux/Slices/categoriesSlice";
import { Box } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";

const Categories = () => {
  const cats = useSelector(selectCategories);

  const tableHeaders = [
    // {
    //   text: "ID",
    //   key: "_id",
    //   // showEllipses: true,
    //   // maxWidth: 120,
    //   sortable: true,
    // },
    { text: "Category", key: "name", sortable: true },
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
