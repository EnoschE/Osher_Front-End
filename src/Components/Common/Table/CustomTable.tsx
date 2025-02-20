import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomTablePagination from "./CustomTablePagination";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import { selectColors } from "../../../Redux/Slices/generalSlice";

import { allRoutes } from "../../../Routes/AllRoutes";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { formatNumber } from "../../../Utils/utils";

interface HeaderProps {
  text: string;
  key: string;
  alternateKey?: string;
  showEllipses?: boolean;
  maxWidth?: number;
  // align?: "center" | "left" | "right" | "inherit" | "justify" | undefined;
  align?: any;
  customComponent?: (props: {
    text: string;
    id: string;
    fullObject: any;
    mongoId?: string;
    sequentialId?: string;
  }) => any;
  notClickable?: boolean;
  sortable?: boolean;
  sequentialId?: string;
}

interface CustomTableProps {
  headers?: Array<HeaderProps>;
  rows?: Array<any>;
  hidePagination?: boolean;
  disableRowClick?: boolean;
  extraPaddingInParent?: number;
  detailsPagePath?: string;
  rowsPerPage?: number;
  onRowClick?: (row: any) => void;
}

interface SortConfig {
  key: string | null;
  direction: 1 | -1;
}

export const tableHeaders = [
  { text: "ID", key: "sequentialId", showEllipses: true, maxWidth: 75 },
  { text: "Name", key: "name" },
  { text: "Email address", key: "email" },
];

const CustomTable = ({
  headers,
  rows,
  hidePagination,
  extraPaddingInParent,
  detailsPagePath = "", // disableRowClick,
  rowsPerPage = 10, // total rows to be displayed on table on one page
  onRowClick,
}: CustomTableProps) => {
  const colors = useSelector(selectColors);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const totalPages = Math.ceil((rows?.length ?? 1) / rowsPerPage); // finding total pages for pagination

  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 1,
  });

  const requestSort = (key: string) => {
    let direction: 1 | -1 = 1;
    let keyToBeSet: string | null = key;
    if (sortConfig.key === key && sortConfig.direction === 1) {
      direction = -1;
    }
    if (sortConfig.key === key && sortConfig.direction === -1) {
      keyToBeSet = null;
      direction = 1;
    }
    setSortConfig({ key: keyToBeSet, direction });
  };
  const sortedRows = useMemo(() => {
    if (!sortConfig.key || !rows) return rows;

    const rowsCopy = [...rows];

    return rowsCopy.sort((a, b) => {
      const key = sortConfig.key!;
      let x = a[key];
      let y = b[key];

      // Determine if the values are numbers or strings
      const isNumeric = !isNaN(Number(x)) && !isNaN(Number(y));

      if (isNumeric) {
        // For numbers, compare numerically
        return sortConfig.direction * (Number(x) - Number(y));
      } else {
        // For strings, compare case-insensitively
        x = String(x).toUpperCase();
        y = String(y).toUpperCase();
        return x === y ? 0 : (x > y ? 1 : -1) * sortConfig.direction;
      }
    });
  }, [rows, sortConfig]);
  const handleRowClick = (id: string, row: any) => {
    console.log({ id });
    if (detailsPagePath)
      navigate(
        id === user.id
          ? allRoutes.ACCOUNT_SETTINGS
          : detailsPagePath?.replace(":id", id)
      );
    if (onRowClick) onRowClick(row);
  };

  return (
    <>
      <TableContainer
        sx={{
          mt: 32,
          maxWidth: `calc(100vw - 32px - 32px${
            extraPaddingInParent ? ` - ${extraPaddingInParent * 2}px` : ""
          })`,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {headers?.map((header: HeaderProps, idx: number) => (
                <TableCell
                  key={idx}
                  align={header.align || "left"}
                  onClick={() => header.sortable && requestSort(header.key)}
                >
                  <Box
                    display={"flex"}
                    alignItems='center'
                    justifyContent={
                      header.align === "right"
                        ? "end"
                        : header.align === "center"
                        ? "center"
                        : "start"
                    }
                    style={{ cursor: header.sortable ? "pointer" : "default" }}
                  >
                    {header.text}

                    {header.sortable &&
                      (sortConfig.key === header.key ? (
                        sortConfig.direction === 1 ? (
                          <ArrowUpwardOutlinedIcon
                            sx={{
                              fontSize: "18px",
                              color: colors.gray,
                              ml: "5px",
                            }}
                          />
                        ) : (
                          <ArrowDownwardOutlinedIcon
                            sx={{
                              fontSize: "18px",
                              color: colors.gray,
                              ml: "5px",
                            }}
                          />
                        )
                      ) : null)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& tr": {
                "&:nth-last-of-type(1)": {
                  "& td": {
                    borderBottom: 0,
                  },
                },

                "&:hover":
                  detailsPagePath || onRowClick // TODO: add onClick option as well here
                    ? {}
                    : {
                        cursor: "auto",
                        boxShadow: "none !important",
                      },
              },
            }}
          >
            {sortedRows?.map((row, idx) => {
              if (idx >= (page - 1) * rowsPerPage && idx < page * rowsPerPage) {
                return (
                  <TableRow
                    key={idx}
                    // onClick={disableRowClick ? undefined : () => handleRowClick?.(row._id)}
                  >
                    {headers?.map((header: HeaderProps, idx: number) => (
                      <TableCell
                        align={header.align || "left"}
                        key={idx}
                        onClick={
                          header.notClickable
                            ? undefined
                            : () =>
                                handleRowClick(
                                  user.id === row._id
                                    ? row._id
                                    : row.sequentialId,
                                  row
                                )
                        }
                      >
                        {header.customComponent ? (
                          header.customComponent({
                            text: row[header.key]
                              ? row[header.key]
                              : header.alternateKey
                              ? row[header.alternateKey]
                              : "-",
                            id: row._id,
                            mongoId: row.mongoId,
                            sequentialId: row.sequentialId,
                            fullObject: row,
                          })
                        ) : header?.showEllipses ? (
                          <Box style={{ maxWidth: header?.maxWidth ?? 150 }}>
                            <Tooltip
                              title={row?.[header.key] ?? "-"}
                              placement='top'
                              arrow
                            >
                              <Typography
                                fontSize='inherit'
                                fontWeight='inherit'
                                sx={{
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {(row?.[header.key]
                                  ? typeof row?.[header.key] === "number"
                                    ? formatNumber(row?.[header.key])
                                    : row?.[header.key]
                                  : header.alternateKey &&
                                    row?.[header.alternateKey]
                                  ? typeof row?.[header.alternateKey] ===
                                    "number"
                                    ? formatNumber(row?.[header.alternateKey])
                                    : row?.[header.alternateKey]
                                  : "") || "-"}
                              </Typography>
                            </Tooltip>
                          </Box>
                        ) : (
                          (row?.[header.key]
                            ? typeof row?.[header.key] === "number"
                              ? formatNumber(row?.[header.key])
                              : row?.[header.key]
                            : header.alternateKey && row?.[header.alternateKey]
                            ? typeof row?.[header.alternateKey] === "number"
                              ? formatNumber(row?.[header.alternateKey])
                              : row?.[header.alternateKey]
                            : "") || "-"
                        )}
                        {row._id === user.id && header.key === "name" ? (
                          <Typography
                            component='span'
                            fontSize='12px'
                            color='text.secondary'
                          >
                            {" "}
                            (Me)
                          </Typography>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }
              return <React.Fragment key={idx} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!hidePagination && (
        <CustomTablePagination
          page={page}
          totalPages={totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      )}
    </>
  );
};

export default CustomTable;
