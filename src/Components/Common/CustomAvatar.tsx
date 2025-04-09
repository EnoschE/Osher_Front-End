import { Avatar, SxProps } from "@mui/material";
import colors from "../../Utils/colors";

interface CustomAvatarProps {
  src?: string;
  size?: "xs" | "sm";
  sx?: SxProps;
}

const CustomAvatar = ({
  src,
  sx,
  size = "sm",
  ...props
}: CustomAvatarProps) => {
  const sizeMap = {
    xs: 24,
    sm: 40,
  };

  return (
    <Avatar
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        minWidth: sizeMap[size],
        minHeight: sizeMap[size],
        border: `1px solid ${colors.border}`,
        ...sx,
      }}
      src={src}
      {...props}
    />
  );
};

export default CustomAvatar;
