import { Avatar, Box, Skeleton, SxProps } from "@mui/material";
import colors from "../../Utils/colors";
import { useState } from "react";
import { borderRadius } from "../../Utils/spacings";

interface CustomAvatarProps {
  src?: string;
  isSquarish?: boolean;
  size?: "xs" | "sm" | "lg";
  sx?: SxProps;
}

const CustomAvatar = ({
  src,
  isSquarish,
  sx,
  size = "sm",
  ...props
}: CustomAvatarProps) => {
  const sizeMap = { xs: 24, sm: 40, lg: 130 };
  const borderWidth = size === "lg" ? 2 : 1;
  const radius = isSquarish
    ? size === "lg"
      ? borderRadius.xl
      : borderRadius.sm
    : "50%";

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
          borderRadius: radius,
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
          borderRadius: radius,
        }}
        animation='wave'
      />
    </Box>
  );
};

export default CustomAvatar;
