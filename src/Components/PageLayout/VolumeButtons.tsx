import { useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogContent, LinearProgress } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import {
  VolumeDownOutlined,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import { borderRadius } from "../../Utils/spacings";
// import AudioFile from "../../Assets/Audio/audio.mp3";

const VolumePopUp = ({
  open,
  volume,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  volume: number;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideBackdrop
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: borderRadius.xl,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "saturate(200%) blur(12px)",
          WebkitBackdropFilter: "saturate(200%) blur(12px)",
          pointerEvents: "auto",
        },
      }}
      sx={{ pointerEvents: "none" }}
    >
      <DialogContent
        sx={{
          width: 240,
          height: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 42,
          color: "white",
          "& svg": {
            width: 100,
            height: 100,
          },
        }}
      >
        {volume === 0 ? (
          <VolumeOffOutlined />
        ) : volume < 50 ? (
          <VolumeDownOutlined />
        ) : (
          <VolumeUpOutlined />
        )}
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant='determinate'
            value={volume}
            color='inherit'
            sx={{
              height: 14,
              borderRadius: 20,
              "& .MuiLinearProgress-bar": { borderRadius: 20 },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const VolumeButtons = () => {
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [volumePopupOpen, setVolumePopupOpen] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openVolumePopup = () => {
    setVolumePopupOpen(true);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setVolumePopupOpen(false);
    }, 1200);
  };

  const muteMe = (element: HTMLMediaElement) => {
    if (element.muted) {
      element.muted = false;
      element.volume = previousVolume / 100; // Restore previous volume
    } else {
      setPreviousVolume(volume); // Save current volume before muting
      element.muted = true;
    }
  };

  const volChange = (element: HTMLMediaElement, role: "up" | "down") => {
    if (element.muted) element.muted = false;
    if (role === "up" && element.volume < 1) {
      element.volume = Math.min(element.volume + 0.1, 1);
    } else if (role === "down" && element.volume > 0) {
      element.volume = Math.max(element.volume - 0.1, 0);
    }
  };

  const handleVolumeUp = () => {
    openVolumePopup();
    document
      .querySelectorAll<HTMLMediaElement>("video, audio")
      .forEach((element) => {
        volChange(element, "up");
      });
    setVolume((prev) => Math.min(prev + 10, 100));
  };

  const handleVolumeDown = () => {
    openVolumePopup();
    document
      .querySelectorAll<HTMLMediaElement>("video, audio")
      .forEach((element) => {
        volChange(element, "down");
      });
    setVolume((prev) => Math.max(prev - 10, 0));
  };

  const handleMute = () => {
    openVolumePopup();
    document
      .querySelectorAll<HTMLMediaElement>("video, audio")
      .forEach((element) => {
        muteMe(element);
      });
    // Update volume UI based on mute state
    setVolume((prev) => (prev === 0 ? previousVolume : 0));
  };

  // Set initial volume from any audio or video element
  useEffect(() => {
    const mediaElement =
      document.querySelector<HTMLMediaElement>("video, audio");
    if (mediaElement) {
      const vol = Math.round(mediaElement.volume * 100);
      setVolume(vol);
      setPreviousVolume(vol);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <CustomButton variant='text' onClick={handleMute}>
        <VolumeOffOutlined />
        Mute
      </CustomButton>

      <CustomButton variant='text' onClick={handleVolumeDown}>
        <VolumeDownOutlined />
        Down
      </CustomButton>

      <CustomButton variant='text' onClick={handleVolumeUp}>
        <VolumeUpOutlined />
        Up
      </CustomButton>

      <VolumePopUp
        volume={volume}
        open={volumePopupOpen}
        onClose={() => setVolumePopupOpen(false)}
      />

      {/* <audio autoPlay controls>
        <source src={AudioFile} />
      </audio> */}
    </>
  );
};

export default VolumeButtons;
