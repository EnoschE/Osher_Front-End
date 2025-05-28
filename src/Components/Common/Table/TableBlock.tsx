import { Box, Tooltip, Typography } from "@mui/material";
import CustomTable, { TableHeaderProps } from "./CustomTable";
import PlaceholderForEmptyTable from "./PlaceholderForEmptyTable";
import CustomTextField from "../CustomTextField";
import { Add, SearchOutlined } from "@mui/icons-material";
import CustomButton from "../CustomButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedHeading from "../AnimatedHeading";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
  tableHeaders,
  disabledAddButton,
  addButtonTooltip,
  onRowClick,
  tableData,
  isLoading,
  getDataFn,
}: {
  getDataFn?: () => Promise<any>;
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
  tableHeaders: Array<TableHeaderProps>;
  onRowClick?: (row: any) => void;
  tableData?: Array<any>;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    if (tableData?.length) {
      setData(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    if (isLoading !== undefined) {
      setLoading(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (!getDataFn) return;

    setLoading(true);
    try {
      const data: any = await getDataFn();
      setData(data);
    } catch (error: any) {
      toast.error(t(error));
    }
    setLoading(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchedTableData = search
    ? data?.filter((item) =>
        tableHeaders.some(({ key }) =>
          item[key]?.toString()?.toLowerCase()?.includes(search.toLowerCase())
        )
      )
    : data;

  return (
    <>
      <AnimatedHeading
        heading={`${t(heading)} ${
          data?.length ? `(${searchedTableData?.length})` : ""
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
        <Typography
          variant='body2'
          className='animated-block'
          sx={{ animationDelay: `${1 / 21}s` }}
        >
          {t(subHeading)}
        </Typography>

        <Box
          display='flex'
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent='flex-end'
          gap={12}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {!!data?.length && (
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
            <Tooltip title={t(addButtonTooltip || "")} arrow>
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
                {t(addButtonText)}
              </CustomButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box className='animated-block' sx={{ animationDelay: `${4 / 21}s` }}>
        {data?.length && !loading ? (
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
            isLoading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default TableBlock;
