import { Box, Skeleton, Typography } from "@mui/material";
import { borderRadius } from "../../../Utils/spacings";
import colors from "../../../Utils/colors";
import { useTranslation } from "react-i18next";

interface PlaceholderForEmptyTableProps {
  message?: string;
  isLoading?: boolean;
}

const PlaceholderForEmptyTable = ({
  message,
  isLoading,
}: PlaceholderForEmptyTableProps) => {
  const { t } = useTranslation();

  return isLoading ? (
    <Box display='flex' flexDirection='column' gap={5}>
      {[...Array(5)].map((_, index) => (
        <Skeleton
          key={index}
          variant='rectangular'
          height={30}
          width={"100%"}
          sx={{ borderRadius: borderRadius.sm }}
        />
      ))}
    </Box>
  ) : (
    <Box
      p='60px 20px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      borderRadius={borderRadius.sm}
      border={`2px dashed ${colors.border}`}
    >
      <Typography textAlign='center' color='text.secondary'>
        {t(message || "No data present")}
      </Typography>
    </Box>
  );
};

export default PlaceholderForEmptyTable;
