import { Box, Typography } from "@mui/material";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectColors } from "../../../Redux/Slices/generalSlice";

import { borderRadius } from "../../../Utils/spacings";

interface PlaceholderForEmptyTableProps {
  message?: string;
}

const PlaceholderForEmptyTable = ({
  message,
}: PlaceholderForEmptyTableProps) => {
  const colors = useSelector(selectColors);

  return (
    <Box
      p='60px 20px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      borderRadius={borderRadius.sm}
      border={`2px dashed ${colors.border}`}
    >
      <Typography textAlign='center' color='text.secondary'>
        {message || "No data present"}
      </Typography>
    </Box>
  );
};

export default PlaceholderForEmptyTable;
