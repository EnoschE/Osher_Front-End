import { useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogContent, LinearProgress } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import {
  VolumeDownOutlined,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import { borderRadius } from "../../Utils/spacings";

const VolumePopUp = ({ volume }: { volume: number }) => {
  return (
    <Dialog
      open
      hideBackdrop
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      PaperProps={{ sx: { borderRadius: borderRadius.xl } }}
      // BackdropProps={{ sx: { backdropFilter: "none", bgcolor: "transparent" } }}
    >
      <DialogContent
        sx={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {volume === 0 ? (
          <VolumeOffOutlined fontSize='large' />
        ) : volume < 50 ? (
          <VolumeDownOutlined fontSize='large' />
        ) : (
          <VolumeUpOutlined fontSize='large' />
        )}
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant='determinate'
            value={volume}
            sx={{ height: 10 }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const VolumeButtons = () => {
  const [volume, setVolume] = useState(50); // Initial 50%
  const [volumePopupOpen, setVolumePopupOpen] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openVolumePopup = () => {
    setVolumePopupOpen(true);

    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }

    popupTimeoutRef.current = setTimeout(() => {
      setVolumePopupOpen(false);
    }, 2000);
  };

  const handleVolumeUp = () => {
    setVolume((prev) => Math.min(prev + 10, 100)); // Increase by 10%, max 100
    openVolumePopup();
  };

  const handleVolumeDown = () => {
    setVolume((prev) => Math.max(prev - 10, 0)); // Decrease by 10%, min 0
    openVolumePopup();
  };

  const handleMute = () => {
    setVolume(0);
    openVolumePopup();
  };

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

      {volumePopupOpen && <VolumePopUp volume={volume} />}
    </>
  );
};

export default VolumeButtons;
