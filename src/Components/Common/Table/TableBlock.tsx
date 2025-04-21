import { Box, Tooltip, Typography } from "@mui/material";
import CustomTable from "./CustomTable";
import PlaceholderForEmptyTable from "./PlaceholderForEmptyTable";
import CustomTextField from "../CustomTextField";
import { Add, SearchOutlined } from "@mui/icons-material";
import CustomButton from "../CustomButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllInstallerCompanies } from "../../../Services/dashboardService";
import { toast } from "react-toastify";
import CustomDropdown from "../CustomDropdown";
import AnimatedHeading from "../AnimatedHeading";


export const TableBlock = ({
  heading,
  subHeading,
  addButtonText,
  addButtonPath,
  addButtonClick,
  emptyStateMessage,
  addButtonState,
  detailsPagePath,
  rowsPerPage = 10,
  tableData,
  tableHeaders,
  disabledAddButton,
  addButtonTooltip,
  filterByCompany = false,
  onRowClick,
}: {
  heading: string;
  subHeading: string;
  addButtonText?: string;
  addButtonPath?: string;
  addButtonClick?: () => void;
  emptyStateMessage?: string;
  addButtonState?: any;
  disabledAddButton?: boolean;
  addButtonTooltip?: string;
  detailsPagePath?: string;
  rowsPerPage?: number;
  tableData?: Array<any>;
  tableHeaders: Array<any>;
  filterByCompany?: boolean;
  onRowClick?: (row: any) => void;
}) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [allCompanies, setAllCompanies] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (filterByCompany) {
      getAllInstallerCompaniesData();
    }
  }, [filterByCompany]);

  const getAllInstallerCompaniesData = async () => {
    setLoading(true);
    try {
      let { data }: any = await getAllInstallerCompanies();
      data = data.map((item: any) => ({
        ...item,
        value: item._id,
        text: item.name,
      }));
      setAllCompanies(data);
      setSelectedId("");
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleDropdown = (value: string) => {
    setSelectedId(value);
  };

  let searchedTableData = search
    ? tableData?.filter(
        (item) =>
          item.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.description?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.address?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.phone?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.userName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.brandName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item.email?.toLowerCase()?.includes(search?.toLowerCase()) // TODO: in future, change this logic to dynamic and add all tableHeaders here
      )
    : tableData;

  if (selectedId && searchedTableData && filterByCompany) {
    searchedTableData = searchedTableData.filter(
      (item) => item.companyId === selectedId
    );
  }

  return (
    <>
      {/* <Typography variant='h3' mb={8}>
        {heading} {tableData?.length ? `(${searchedTableData?.length})` : ""}
      </Typography> */}
      <AnimatedHeading
        heading={`${heading} ${
          tableData?.length ? `(${searchedTableData?.length})` : ""
        }`}
        variant='h3'
      />
      <Box
        display='flex'
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent='space-between'
        flexDirection={{ xs: "column", md: "row" }}
        gap={12}
        mb={32}
        mt={8}
      >
        {/* <AnimatedHeading
          heading={subHeading}
          variant='body2'
          animationSpeed='fast'
          animationDelay={0.1}
        /> */}
        {/* <AnimatedBlock animationDelay={0.3}> */}
        <Typography
          variant='body2'
          className='animated-block'
          sx={{ animationDelay: `${1 / 21}s` }}
        >
          {subHeading}
        </Typography>
        {/* </AnimatedBlock> */}

        <Box
          display='flex'
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent='flex-end'
          gap={12}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {!!tableData?.length && (
            <>
              {filterByCompany && (
                <CustomDropdown
                  options={allCompanies}
                  value={selectedId}
                  onChange={handleDropdown}
                  minWidth='220px'
                  label='Filter by Company'
                  defaultSelectable={true}
                  disabled={loading}
                />
              )}
              {/* <AnimatedBlock animationDelay={0.35}> */}
              <CustomTextField
                value={search}
                onChange={handleOnChange}
                placeholder='Search here'
                startIcon={<SearchOutlined sx={{ opacity: 0.7 }} />}
                className='animated-block'
                style={{ animationDelay: `${2 / 21}s` }}
              />
              {/* </AnimatedBlock> */}
            </>
          )}
          {addButtonText && (
            // <AnimatedBlock animationDelay={0.45}>
            <Tooltip title={addButtonTooltip} arrow>
              {/* <span> */}
              <CustomButton
                className='animated-block'
                sx={{
                  animationDelay: `${3 / 21}s`,
                  height: 40.13,
                  minWidth: "max-content",
                }}
                startIcon={<Add />}
                onClick={() =>
                  addButtonClick?.() ||
                  navigate(addButtonPath || "", { state: addButtonState })
                }
                disabled={disabledAddButton}
              >
                {addButtonText}
              </CustomButton>
              {/* </span> */}
            </Tooltip>
            // </AnimatedBlock>
          )}
        </Box>
      </Box>

      <Box className='animated-block' sx={{ animationDelay: `${4 / 21}s` }}>
        {tableData?.length ? (
          <CustomTable
            headers={tableHeaders}
            rows={searchedTableData}
            detailsPagePath={detailsPagePath}
            rowsPerPage={rowsPerPage}
            onRowClick={onRowClick}
          />
        ) : (
          <PlaceholderForEmptyTable message={emptyStateMessage} />
        )}
      </Box>
    </>
  );
};

export default TableBlock;
