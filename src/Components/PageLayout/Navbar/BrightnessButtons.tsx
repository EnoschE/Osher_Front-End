import { useEffect, useRef, useState } from "react";
import { Box, Popover, Slider } from "@mui/material";
import {
  Brightness4Outlined,
  BrightnessLowOutlined,
  Brightness7Outlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../../Utils/spacings";
import CustomButton from "../../Common/CustomButton";

// Helper: Get icon based on brightness
const getBrightnessIcon = (brightness: number) => {
  if (brightness < 0.4) return <Brightness4Outlined />;
  if (brightness < 0.7) return <BrightnessLowOutlined />;
  return <Brightness7Outlined />;
};

const BrightnessControl = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [brightness, setBrightness] = useState<number>(1);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const open = Boolean(anchorEl);

  const applyBrightness = (value: number) => {
    const root = document.getElementById("root");
    if (root) {
      root.style.filter = `brightness(${value})`;
    }
  };

  useEffect(() => {
    // Apply saved or default brightness
    const saved = localStorage.getItem("brightness");
    const val = saved ? parseFloat(saved) : 1;
    setBrightness(val);
    applyBrightness(val);
  }, []);

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const newVal = Array.isArray(value) ? value[0] : value;
    setBrightness(newVal);
    applyBrightness(newVal);
    localStorage.setItem("brightness", newVal.toString());

    // Reset auto-close timer
    resetAutoCloseTimer();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    resetAutoCloseTimer();
  };

  const handleClose = () => {
    setAnchorEl(null);
    clearTimeout(autoCloseTimeoutRef.current!);
  };

  const resetAutoCloseTimer = () => {
    clearTimeout(autoCloseTimeoutRef.current!);
    autoCloseTimeoutRef.current = setTimeout(() => {
      handleClose();
    }, 2000);
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, anchorEl]);

  return (
    <>
      <CustomButton onClick={handleClick} variant='text'>
        {getBrightnessIcon(brightness)}
        {t("Brightness")}
      </CustomButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        hideBackdrop
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
        disableEscapeKeyDown
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          ref: popoverRef,
          sx: {
            p: "24px 18px 28px 18px",
            borderRadius: borderRadius.lg,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px) saturate(200%)",
            color: "#fff",
            marginBottom: 20,
            boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
            pointerEvents: "auto",
          },
        }}
        sx={{
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            height: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            gap: 20,
          }}
        >
          {getBrightnessIcon(brightness)}
          <Slider
            orientation='vertical'
            value={brightness}
            min={0.1}
            max={1}
            step={0.05}
            onChange={handleSliderChange}
            sx={{
              color: "white",
              "& .MuiSlider-thumb": {
                backgroundColor: "white",
              },
              "& .MuiSlider-track": {
                backgroundColor: "white",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "rgba(255,255,255,0.3)",
              },
            }}
          />
        </Box>
      </Popover>
    </>
  );
};

export default BrightnessControl;
