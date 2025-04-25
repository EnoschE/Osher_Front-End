import { Box, Pagination } from "@mui/material";
import { borderRadius } from "../../../Utils/spacings";
import colors from "../../../Utils/colors";

interface CustomTablePaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
}

const CustomTablePagination = ({
  page = 1,
  totalPages = 1,
  onChange,
}: CustomTablePaginationProps) => {
  const handleOnChange = (e: any, pageNumber: number) => {
    onChange?.(pageNumber);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        pt: 24,
      }}
    >
      <Pagination
        size='small'
        color='primary'
        shape='rounded'
        page={page}
        onChange={handleOnChange}
        count={totalPages}
        sx={{
          "& button": {
            color: colors.text,
            borderRadius: borderRadius.xs,
            fontWeight: 400,

            "&.Mui-selected": {
              fontWeight: 600,
              color: colors.primary,
              bgcolor: colors.primaryMidLight,
            },
          },
        }}
      />
    </Box>
  );
};

export default CustomTablePagination;
