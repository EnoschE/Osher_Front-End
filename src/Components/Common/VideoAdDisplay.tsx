import { useEffect, useRef, useState } from "react";
import { Backdrop, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useVideoAdFetcher } from "../../Hooks/useVideoAdFetcher";
import { frostedGlassEffect } from "../../Utils/colors";
import { borderRadius } from "../../Utils/spacings";

const VideoAdDisplay = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ad, loading } = useVideoAdFetcher();

  const [open, setOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const handleLoadedMetadata = () => {
    const duration = videoRef.current?.duration;
    if (duration && !isNaN(duration)) {
      const durationMs = Math.floor(duration * 1000);
      setTimeLeft(durationMs);
    }
  };

  useEffect(() => {
    if (!open || timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) return null;
        const newTime = prevTime - 1000;

        if (newTime <= 0) {
          clearInterval(interval);
          setOpen(false);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, timeLeft]);

  const formatTime = (milliseconds: number | null) => {
    if (milliseconds === null) return "--:--";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (!open && !loading) return null;

  return (
    <Backdrop
      sx={{
        position: "fixed !important",
        width: "100vw",
        height: "100vh",
        top: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backdropFilter: "none",
        backgroundColor: "#000",
      }}
      open={open}
    >
      {!!ad ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "8px 12px",
              zIndex: 1,
              backgroundColor: "rgba(256,256,256, 0.65)",
              borderRadius: borderRadius.lg,
              ...frostedGlassEffect,
            }}
          >
            {t("Ad will skip in ")}
            {formatTime(timeLeft)}
          </Box>

          <video
            ref={videoRef}
            src={ad.picture}
            onLoadedMetadata={handleLoadedMetadata}
            autoPlay
            muted
            playsInline
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "contain",
            }}
          />
        </>
      ) : (
        <Typography color='gray'>{t("AD is loading")}</Typography>
      )}
    </Backdrop>
  );
};

export default VideoAdDisplay;
