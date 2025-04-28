import { useEffect, useState } from "react";
import { Backdrop, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

const napMinutes = 3; // 3 Minutes
export const napTime = napMinutes * 60 * 1000; // Converting minutes to milliseconds

const NapScreen = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(napTime);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (open) {
      setTimeLeft(napTime);
      setRenderKey((prev) => prev + 1);

      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1000;

          if (newTime <= 0) {
            clearInterval(interval);
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [open]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <Backdrop
      sx={{
        position: "fixed !important",
        width: "100vw",
        height: "100vh",
        top: 0,
        zIndex: 1300,
        backdropFilter: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        backgroundColor: "#000",
      }}
      open={open}
    >
      <IconButton
        onClick={onClick}
        size='large'
        sx={{
          color: "white",
          border: "1px solid gray",
          position: "absolute",
          top: 30,
          right: 30,
        }}
      >
        <Close />
      </IconButton>

      <Typography
        key={`title-${renderKey}`} // Render the animation every time we open the Nap screen
        color='white'
        variant='h5'
        className='animated-block'
        sx={{ animationDelay: "0.1s" }}
      >
        This screen will disappear after:
      </Typography>

      <Typography
        key={`timer-${renderKey}`}
        color='white'
        variant='h1'
        className='animated-block'
        sx={{ animationDelay: "0.2s" }}
      >
        {formatTime(timeLeft)}
      </Typography>
    </Backdrop>
  );
};

export default NapScreen;
