import { Box, Skeleton, SxProps } from "@mui/material";
import colors from "../../Utils/colors";
import { useState, useEffect, useRef } from "react";
import { borderRadius } from "../../Utils/spacings";

interface PostPictureProps {
  src?: string;
  onClick?: () => void;
  sx?: SxProps;
}

const PostPicture = ({ src, onClick, sx, ...props }: PostPictureProps) => {
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
      ref={containerRef}
      position='relative'
      sx={{
        minHeight: isVisible ? "auto" : 350,
        borderRadius: borderRadius.xl,
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
            objectFit: "contain",
            borderRadius: borderRadius.xl,
            minHeight: isVisible ? "auto" : 350,
            border: `0.5px solid ${colors.border}`,
            display: loaded ? "block" : "none",
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
          minHeight: 350,
          display: isVisible ? "none" : "block",
          borderRadius: borderRadius.xl,
          border: `0.5px solid ${colors.border}`,
        }}
        animation='wave'
      />
    </Box>
  );
};

export default PostPicture;
