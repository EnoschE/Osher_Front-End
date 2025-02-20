import { Box, Divider, Typography } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { CheckRounded } from "@mui/icons-material";
import CustomButton from "../Common/CustomButton";
import { useEffect, useState } from "react";
import AcceptProposalDialog from "./AcceptProposalDialog";
import { formatNumber } from "../../Utils/utils";

interface ItemData {
  heading: string;
  subHeading: string;
  price: number;
  options: Array<string>;
  isHighlighted?: boolean;
  buttonOnClick: () => void;
}
interface PlanCardProps {
  item: ItemData;
}

const Option = ({ text }: { text?: string }) => {
  const colors = useSelector(selectColors);
  return (
    <Box display='flex' gap={17}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primaryMidLight,
          color: colors.primary,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
        }}
      >
        <CheckRounded fontSize='inherit' />
      </Box>
      <Typography mt={2} color='text.secondary'>
        {text}
      </Typography>
    </Box>
  );
};

const PlanCard = ({ item }: PlanCardProps) => {
  const colors = useSelector(selectColors);
  return (
    <Box
      sx={{
        padding: "40px 30px",
        borderRadius: borderRadius.md,
        border: `2px solid ${colors.lightGray}`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        boxShadow: item.isHighlighted ? "0px 20px 47px 0px #0000000D" : "unset",
      }}
    >
      <Typography variant='h3'>{item.heading}</Typography>
      <Typography fontSize={16} color='text.secondary'>
        {item.subHeading}
      </Typography>
      <Typography variant='h1' fontSize={42}>
        ${formatNumber(item.price)}{" "}
        <Typography component='span' variant='h6' color='text.secondary'>
          / Month
        </Typography>
      </Typography>
      <Divider sx={{ mt: 19, mb: 12 }} />
      <Box display='flex' flexDirection='column' gap={16} mb={22}>
        {item.options?.map((item) => <Option key={item} text={item} />)}
      </Box>
      <CustomButton
        sx={{
          mt: "auto",
          ...(item.isHighlighted
            ? {}
            : {
                backgroundColor: colors.primaryMidLight,
                color: "primary.main",
                "&:hover": { color: "white" },
              }),
        }}
        onClick={item.buttonOnClick}
      >
        Select Plan
      </CustomButton>
    </Box>
  );
};

const SelectPlan = ({ id, data }: { id?: string; data?: any }) => {
  const colors = useSelector(selectColors);

  const [paymentsData, setPaymentsData] = useState<any>(data);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  useEffect(() => {
    setPaymentsData(data);
  }, [data]);

  const plans = [
    {
      heading: "Cash",
      subHeading: "For customers who choose to avoid interest expenses",
      price: paymentsData?.CashOption || 0,
      buttonOnClick: openDialog,
      options: [
        "25 year warranties Included",
        "Own the system from day 1",
        "Completely pay off solar",
        "Lowest lifetime expenses",
        "Tax credits and local rebates",
      ],
    },
    {
      heading: "Loan",
      subHeading: "For customers who have the federal tax liability",
      price: paymentsData?.loanPayment || 0,
      buttonOnClick: openDialog,
      options: [
        "25 year warranties Included",
        "Own the system from day 1",
        "Fixed for 25 years",
        "Best value plan",
        "Tax credits and local rebates",
      ],
      isHighlighted: true,
    },
    {
      heading: "Lease",
      subHeading: "For customer with low federal tax liability or appetite",
      price: paymentsData?.leasePayment || 0,
      buttonOnClick: openDialog,
      options: [
        "25 year warranties Included",
        "No day 1 system ownership",
        "Can be acquired after 5 years",
        "Bill increases by 1.9% per year",
        "Tax credits transferred  through savings",
      ],
    },
  ];

  return (
    <Box id={id} mb={106}>
      <Box display='flex' flexDirection='column' alignItems='center' mt={60}>
        <Typography variant='h2' mb={10} textAlign='center'>
          Select Your Plan
        </Typography>
        <Typography fontSize={16} mb={24} maxWidth={768} textAlign='center'>
          Below is a list of your top three solar options. Note that additional
          options may be available. If you wish to discuss other options,
          schedule a chat with a specialist below.
        </Typography>
      </Box>

      <Box
        display='grid'
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }}
        gap={30}
      >
        {plans.map((item: ItemData) => (
          <PlanCard key={item.heading} item={item} />
        ))}
      </Box>

      <AcceptProposalDialog open={showDialog} onClose={closeDialog} />
    </Box>
  );
};

export default SelectPlan;
