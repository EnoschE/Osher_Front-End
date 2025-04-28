import { useState, useEffect } from "react";
import moment from "moment";
import { Box, Typography } from "@mui/material";
import { isUserLoggedIn } from "../../Services/userService";

const LiveDateTime = () => {
  const isLoggedIn = isUserLoggedIn();

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("h:mm")); // Only time in 12-hour format
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const currentDay = moment().format("ddd"); // Day abbreviation (Mon, Tue, etc.)
  const currentDate = moment().format("DD MMM"); // Date in Day Month format (28 Apr)

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginLeft: { xs: 0, sm: isLoggedIn ? 0 : 60, md: isLoggedIn ? 0 : 120 },
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
