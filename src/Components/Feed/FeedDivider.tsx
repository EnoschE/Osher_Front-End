import { Box } from "@mui/material";
import colors from "../../Utils/colors";

const FeedDivider = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.border,
        height: "1px",
        width: "100%",
        marginBlock: "32px",
      }}
    />
  );
};

export default FeedDivider;
