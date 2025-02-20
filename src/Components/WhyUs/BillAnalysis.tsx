import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import { BorderedBox } from "./whyUsStyles";
import CustomPieChart, { DataSetProps } from "../Common/Charts/CustomPieChart";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { useEffect, useState } from "react";
import { BillDataState, selectUser } from "../../Redux/Slices/userSlice";
import { toast } from "react-toastify";
import { getBillAnalysis } from "../../Services/reportService";

interface ChartBlockProps {
  fontSize?: number;
  size?: number | string;
  title?: string;
  dataSet?: Array<DataSetProps>;
}

const ChartBlock = ({
  dataSet = [],
  title = "",
  size = 286,
  fontSize = 20,
}: ChartBlockProps) => {
  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Box display='flex' flexDirection='column' gap={32}>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100%'
      >
        <CustomPieChart
          size={isMobileView ? 250 : size}
          fontSize={isMobileView ? 20 : fontSize}
          dataSets={dataSet}
        />
      </Box>
      <Typography variant='h4' textAlign='center' mt='auto'>
        {title}
      </Typography>
    </Box>
  );
};

const BillAnalysis = ({
  id,
  billData,
}: {
  id?: string;
  billData?: BillDataState | null;
}) => {
  const colors = useSelector(selectColors);
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    handleBillAnalysis();
  }, [billData?.delivery, billData?.supply]);

  const handleBillAnalysis = async () => {
    if (!billData) return;

    setLoading(true);
    try {
      const monthlyBill = user.bill || "";
      const deliveryService = billData.delivery ?? 67.53;
      const supplyCharges = billData.supply ?? 65.92;

      const { data: billAnalysis } = await getBillAnalysis(
        monthlyBill,
        deliveryService,
        supplyCharges
      );

      setData(billAnalysis);
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <Box id={id}>
      <Typography variant='h2' mt={60} mb={10}>
        Utility Bill Analysis
      </Typography>
      <Typography fontSize={16} mb={32}>
        What to know about your electricity expense with the grid
      </Typography>
      {!billData || (billData && loading) ? (
        <BorderedBox p={{ xs: "100px 24px", sm: "180px 40px" }}>
          <Typography textAlign='center' color='text.secondary' fontSize={16}>
            {loading
              ? "Analyzing your bill..."
              : "Your analysis will be available after you upload your electric bill"}
          </Typography>
        </BorderedBox>
      ) : (
        <BorderedBox p={{ xs: 24, sm: 40 }}>
          <Typography variant='h4' mb={65}>
            Your 25 Year Cost of doing nothing
            <Typography
              component='span'
              variant='inherit'
              color='error.dark'
              ml={20}
            >
              $
              {data?.costOfElectricityWithoutSolar20year?.toLocaleString() || 0}
            </Typography>
          </Typography>

          <Box
            display='flex'
            alignItems='stretch'
            justifyContent='center'
            gap={{ xs: 40, sm: 120 }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <ChartBlock
              size={250}
              fontSize={20}
              dataSet={[
                { label: "Delivery", value: data?.deliveryServiceYear1 || 50 },
                { label: "Supply", value: data?.supplyYear1 || 50 },
              ]}
              title='First Year'
            />
            <ChartBlock
              size={469}
              fontSize={28}
              dataSet={[
                {
                  label: "Delivery",
                  value: data?.deliveryServiceYear20 || 6000,
                },
                { label: "Supply", value: data?.supplyYear20 || 6000 },
              ]}
              title='Over 25 Years'
            />
          </Box>
        </BorderedBox>
      )}
    </Box>
  );
};

export default BillAnalysis;
