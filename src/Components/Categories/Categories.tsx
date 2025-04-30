import PageLayout from "../PageLayout/PageLayout";
import TableBlock from "../Common/Table/TableBlock";
import { useSelector } from "../../Redux/reduxHooks";
import {
  selectCategories,
  selectCategoriesLoading,
} from "../../Redux/Slices/categoriesSlice";

const Categories = () => {
  const cats = useSelector(selectCategories);
  const catsLoading = useSelector(selectCategoriesLoading);

  const tableHeaders = [{ text: "Category", key: "name", sortable: true }];

  return (
    <PageLayout hideBackButton>
      <TableBlock
        isLoading={catsLoading}
        heading='Categories'
        subHeading='These are all the categories'
        tableData={cats}
        tableHeaders={tableHeaders}
        emptyStateMessage='There are no categories present.'
      />
    </PageLayout>
  );
};

export default Categories;
