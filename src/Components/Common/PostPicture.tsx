import { Box, Skeleton, SxProps } from "@mui/material";
import colors from "../../Utils/colors";
import { useState, useEffect, useRef } from "react";
import { borderRadius } from "../../Utils/spacings";

interface PostPictureProps {
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  aspectRatio?: number | string;
  src?: string;
  onClick?: () => void;
  sx?: SxProps;
}

const PostPicture = ({
  className,
  objectFit = "contain",
  aspectRatio,
  src,
  onClick,
  sx,
  ...props
}: PostPictureProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 150px 0px",
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const isVisible = loaded && inView;

  return (
    <Box
      className={className}
      ref={containerRef}
      position='relative'
      sx={{
        aspectRatio,
        minHeight: isVisible ? "auto" : 250,
        borderRadius: borderRadius.xl,
        width: "100%",
        // boxShadow: "rgba(168, 81, 0, 0.15) 0px 65px 50px -30px",
        boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
        cursor: onClick ? "pointer" : "default",
        ...sx,
      }}
      onClick={onClick}
    >
      {inView && (
        <Box
          component='img'
          src={src}
          sx={{
            maxWidth: "100%",
            width: "100%",
            objectFit: objectFit || "contain",
            borderRadius: borderRadius.xl,
            minHeight: isVisible ? "auto" : 350,
            height: "100%",
            border: `0.5px solid ${colors.border}`,
            display: loaded ? "block" : "none",
            aspectRatio,
          }}
          alt='Post Picture'
          onLoad={() => setLoaded(true)}
          {...props}
        />
      )}

      <Skeleton
        variant='rectangular'
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          minWidth: "100%",
          height: "100%",
          // minHeight: 307,
          display: isVisible ? "none" : "block",
          borderRadius: borderRadius.xl,
          border: `0.5px solid ${colors.border}`,
          bgcolor: "#EBEBEE",
          aspectRatio,
        }}
        animation='wave'
      />
    </Box>
  );
};

export default PostPicture;
