import { Box, Skeleton, SxProps, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import colors from "../../Utils/colors";
import { useState, useEffect, useRef } from "react";
import { borderRadius } from "../../Utils/spacings";
import { isVideoFromUrl } from "../../Utils/utils";

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
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = isVideoFromUrl(src);

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

  // Play/pause video based on 50% visibility
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.intersectionRatio >= 0.5) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [loaded]);

  const togglePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent triggering the parent's onClick
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

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
        boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        ...sx,
      }}
      onClick={onClick}
    >
      {inView &&
        (isVideo ? (
          <>
            <Box
              component='video'
              ref={videoRef}
              src={src}
              onLoadedData={() => setLoaded(true)}
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              style={{ display: loaded ? "block" : "none" }}
              {...props}
              sx={{
                objectFit,
                width: "100%",
                height: "100%",
                minHeight: isVisible ? "auto" : 350,
                borderRadius: borderRadius.xl,
                border: `0.5px solid ${colors.border}`,
                aspectRatio,
              }}
            />

            <IconButton
              size='small'
              onClick={togglePlay}
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                borderRadius: "50%",
                zIndex: 2,
                "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </>
        ) : (
          <Box
            component='img'
            src={src}
            onLoad={() => setLoaded(true)}
            alt='Post'
            sx={{
              maxWidth: "100%",
              width: "100%",
              objectFit,
              borderRadius: borderRadius.xl,
              minHeight: isVisible ? "auto" : 350,
              height: "100%",
              border: `0.5px solid ${colors.border}`,
              display: loaded ? "block" : "none",
              aspectRatio,
            }}
            {...props}
          />
        ))}

      <Skeleton
        variant='rectangular'
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          minWidth: "100%",
          height: "100%",
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
