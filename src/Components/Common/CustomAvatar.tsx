import { Avatar, Box, Skeleton, SxProps } from "@mui/material";
import colors from "../../Utils/colors";
import { useState } from "react";

interface CustomAvatarProps {
  src?: string;
  size?: "xs" | "sm" | "xl";
  sx?: SxProps;
}

const CustomAvatar = ({
  src,
  sx,
  size = "sm",
  ...props
}: CustomAvatarProps) => {
  const sizeMap = { xs: 24, sm: 40, xl: 130 };
  const borderWidth = size === "xl" ? 2 : 1;

  const [loading, setLoading] = useState(true);

  return (
    <Box position='relative' sx={{ ...sx }}>
      <Avatar
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
          minWidth: sizeMap[size],
          minHeight: sizeMap[size],
          border: `${borderWidth}px solid ${colors.border}`,
        }}
        src={src}
        onLoad={() => setLoading(false)}
        {...props}
      />

      <Skeleton
        variant='circular'
        sx={{
          position: "absolute",
          inset: 0,
          width: sizeMap[size],
          height: sizeMap[size],
          minWidth: sizeMap[size],
          minHeight: sizeMap[size],
          display: loading ? "block" : "none",
        }}
        animation='wave'
      />
    </Box>
  );
};

export default CustomAvatar;
