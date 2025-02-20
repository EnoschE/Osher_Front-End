import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { WelcomeBlockHeader } from "./whyUsStyles";
import OurSolutions from "./OurSolutions";
import { UserState } from "../../Redux/Slices/userSlice";
import Confetti from "react-confetti";
import CustomCheckBox from "../Common/CustomCheckBox";
import { useState } from "react";

const WelcomeBlock = ({
  id,
  user,
  satelliteImage,
  streetViewImage,
}: {
  id?: string;
  user?: UserState;
  satelliteImage?: any;
  streetViewImage?: any;
}) => {
  const colors = useSelector(selectColors);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [options, setOptions] = useState({
    lowIncome: false,
    energy: false,
    equipment: false,
  });

  return (
    <Box id={id} mt={65}>
      <WelcomeBlockHeader>
        <Box zIndex={2}>
          <Typography variant='h4' color='primary' mb={8}>
            Hello, {user?.name}
          </Typography>
          <Typography variant='h6' fontWeight={400} color='text.secondary'>
            Welcome to your user portal! Let’s customize your solar system for
            best results!
          </Typography>
        </Box>

        <Confetti
          gravity={0.03}
          width={550}
          style={{ marginLeft: "auto", marginTop: -10 }}
        />
      </WelcomeBlockHeader>

      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        fontWeight={500}
        mt={24}
        mb={20}
      >
        Based on the address you provided you may be eligible for the following
        Additional discounts. Check all discount’s you want to be considered for
      </Typography>
      <Box
        display='flex'
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent='space-between'
        flexDirection={{ xs: "column", sm: "row" }}
        gap={10}
      >
        <CustomCheckBox
          text='Low Income Community (Up to 10%)'
          checked={options.lowIncome}
          onChange={() =>
            setOptions({ ...options, lowIncome: !options.lowIncome })
          }
        />
        <CustomCheckBox
          text='Energy Community (Up to 10%)'
          checked={options.energy}
          onChange={() => setOptions({ ...options, energy: !options.energy })}
        />
        <CustomCheckBox
          text='American Equipment Use (Up to 10%)'
          checked={options.equipment}
          onChange={() =>
            setOptions({ ...options, equipment: !options.equipment })
          }
        />
      </Box>

      <OurSolutions
        satelliteImage={satelliteImage}
        streetViewImage={streetViewImage}
      />
    </Box>
  );
};

export default WelcomeBlock;
