import { Avatar, SxProps } from "@mui/material";
import colors from "../../Utils/colors";

const CustomAvatar = ({
  src,
  sx,
  ...props
}: {
  src?: string;
  sx?: SxProps;
}) => {
  return (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        border: `1px solid ${colors.border}`,
        ...sx,
      }}
      src={src}
      {...props}
    />
  );
};

export default CustomAvatar;
