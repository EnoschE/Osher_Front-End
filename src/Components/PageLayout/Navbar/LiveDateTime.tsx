import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { isUserLoggedIn } from "../../../Services/userService";

const LiveDateTime = () => {
  const isLoggedIn = isUserLoggedIn();
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update current time immediately on load
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // Ensures 12-hour format
        })
          .format(now)
          .replace(/(AM|PM)/, "")
          .trim()
      ); // Remove AM/PM
    };

    // Set the initial time immediately
    updateTime();

    const interval = setInterval(updateTime, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const currentDay = new Date().toLocaleString("en-US", { weekday: "short" }); // Day abbreviation (Mon, Tue, etc.)
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  }); // Date in Day Month format (28 Apr)

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginLeft: {
          xs: 4,
          sm: isLoggedIn ? 20 : 60,
          md: isLoggedIn ? 20 : 120,
        },
      }}
    >
      <Typography variant='h2' fontWeight={500} fontSize={45}>
        {currentTime}
      </Typography>

      <Box>
        <Typography fontWeight={500}>{currentDay}</Typography>

        <Typography fontWeight={500}>{currentDate}</Typography>
      </Box>
    </Box>
  );
};

export default LiveDateTime;
