import { Box, Tooltip, Typography } from "@mui/material";
import CustomTable from "./CustomTable";
import PlaceholderForEmptyTable from "./PlaceholderForEmptyTable";
import CustomTextField from "../CustomTextField";
import { Add, SearchOutlined } from "@mui/icons-material";
import CustomButton from "../CustomButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
  onRowClick,
  isLoading,
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
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
}) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

        <Typography
          variant='body2'
          className='animated-block'
          sx={{ animationDelay: `${1 / 21}s` }}
        >
          {subHeading}
        </Typography>

        <Box
          display='flex'
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent='flex-end'
          gap={12}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {!!tableData?.length && (
            <CustomTextField
              value={search}
              onChange={handleOnChange}
              placeholder='Search here'
              startIcon={<SearchOutlined sx={{ opacity: 0.7 }} />}
              className='animated-block'
              style={{ animationDelay: `${2 / 21}s` }}
            />
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
        {tableData?.length && !isLoading ? (
          <CustomTable
            headers={tableHeaders}
            rows={searchedTableData}
            detailsPagePath={detailsPagePath}
            rowsPerPage={rowsPerPage}
            onRowClick={onRowClick}
          />
        ) : (
          <PlaceholderForEmptyTable
            message={emptyStateMessage}
            isLoading={isLoading}
          />
        )}
      </Box>
    </>
  );
};

export default TableBlock;
