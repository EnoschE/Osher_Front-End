import { Avatar, Box, Skeleton, SxProps } from "@mui/material";
import colors from "../../Utils/colors";
import { useState } from "react";
import { borderRadius } from "../../Utils/spacings";
import { isVideoFromUrl } from "./PostPicture";

interface CustomAvatarProps {
  src?: string;
  isSquarish?: boolean;
  size?: "xs" | "sm" | "lg" | "xl";
  sx?: SxProps;
  showLoader?: boolean;
}

const CustomAvatar = ({
  src,
  isSquarish,
  sx,
  showLoader,
  size = "sm",
  ...props
}: CustomAvatarProps) => {
  const sizeMap = { xs: 24, sm: 40, lg: 130, xl: 220 };
  const borderWidth = size === "lg" || size === "xl" ? 2 : 1;
  const radius = isSquarish
    ? size === "lg" || size === "xl"
      ? borderRadius.xl
      : borderRadius.sm
    : "50%";

  const [loading, setLoading] = useState(!!src);
  const isVideo = isVideoFromUrl(src);

  return (
    <Box
      position='relative'
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        minWidth: sizeMap[size],
        minHeight: sizeMap[size],
        ...sx,
      }}
    >
      {!showLoader && (
        <>
          {isVideo ? (
            <video
              src={src}
              style={{
                width: sizeMap[size],
                height: sizeMap[size],
                minWidth: sizeMap[size],
                minHeight: sizeMap[size],
                border: `${borderWidth}px solid ${colors.border}`,
                borderRadius: radius,
                boxShadow: ["lg", "xl"].includes(size)
                  ? `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`
                  : "none",
                objectFit: "cover",
              }}
              onLoadedData={() => setLoading(false)}
              muted
              controls={false}
              {...props}
            />
          ) : (
            <Avatar
              sx={{
                width: sizeMap[size],
                height: sizeMap[size],
                minWidth: sizeMap[size],
                minHeight: sizeMap[size],
                border: `${borderWidth}px solid ${colors.border}`,
                borderRadius: radius,
                boxShadow: ["lg", "xl"].includes(size)
                  ? `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`
                  : "none",
              }}
              src={src}
              onLoad={() => setLoading(false)}
              {...props}
            />
          )}
        </>
      )}

      <Skeleton
        variant='circular'
        sx={{
          position: "absolute",
          inset: 0,
          width: sizeMap[size],
          height: sizeMap[size],
          minWidth: sizeMap[size],
          minHeight: sizeMap[size],
          display: loading || showLoader ? "block" : "none",
          borderRadius: radius,
          bgcolor: "#EBEBEE",
        }}
        animation='wave'
      />
    </Box>
  );
};

export default CustomAvatar;
