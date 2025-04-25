import { ArrowOutward } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const ArrowButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton size="small" sx={{ p: 3 }} onClick={onClick}>
      <ArrowOutward fontSize="small" color="primary" />
    </IconButton>
  );
};

export default ArrowButton;
