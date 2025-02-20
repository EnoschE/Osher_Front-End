import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  BillUploaderBox,
  BillUploaderLoading,
  BorderedBox,
} from "./whyUsStyles";
import { Description } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { useEffect, useState } from "react";
import CustomButton from "../Common/CustomButton";
import BillUploader from "./BillUploader";
import { toast } from "react-toastify";
import { scrollToElement } from "../Common/CustomTabs";
import { scanTextFromImage } from "../../Utils/utils";
import { uploadElectricBill } from "../../Services/reportService";
import { BillDataState, saveBillDetails } from "../../Redux/Slices/userSlice";
import { convertPDFtoJPG } from "../../Services/ocrService";
import { useDispatch } from "../../Redux/reduxHooks";

const extractValueFromText = (text: string, regex: RegExp) => {
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : 0;
};

interface ElectricBillUploadProps {
  id?: string;
  analysisModuleId?: string;
  billData?: BillDataState | null;
  onUpload?: (bill: BillDataState) => void;
}

const ElectricBillUpload = ({
  id,
  analysisModuleId,
  onUpload,
  billData,
}: ElectricBillUploadProps) => {
  const colors = useSelector(selectColors);
  const dispatch = useDispatch();

  const [bill, setBill] = useState<any>("");
  const [uploadedBill, setUploadedBill] = useState<any>("");
  const [uploading, setUploading] = useState<number>(0);

  useEffect(() => {
    if (billData?.file && billData?.file !== uploadedBill) {
      setUploadedBill(billData?.file);
    }
  }, [billData?.file]);

  const handleSelectBill = (pdfFile: any) => {
    setBill(pdfFile);
  };

  const handleBillUploading = async () => {
    if (!bill) return toast.error("Select your bill first!");

    setUploading(5);
    try {
      // updating the loading by 5% after every 1000ms
      setInterval(
        () => setUploading((state) => (state < 90 ? state + 5 : state)),
        1000
      );

      const jpgImages = await convertPDFtoJPG(bill);
      const jpgImage = jpgImages?.[0] ?? "";

      // scanning the uploaded file to fetch the required data
      let text = "";
      for await (const image of jpgImages) {
        text += await scanTextFromImage(image);
      }
      console.log("Scanned Text:", text);

      let supplyRegex;
      let deliveryRegex;
      let otherChargesRegex;
      const isEversourceBill = text?.toLowerCase()?.includes("eversource");

      // extracting the required fields from scanned text
      if (isEversourceBill) {
        supplyRegex = /total supplier services \$([\d.]+)/i;
        deliveryRegex = /total delivery services \$([\d.]+)/i;
        otherChargesRegex = /total current charges \$([\d.]+)/i;
      } else {
        supplyRegex = /total supply services \$\s*([\d.]+)/i;
        deliveryRegex = /total delivery services \$\s*([\d.]+)/i;
        otherChargesRegex = /total other charges\/adjustments \$\s*([\d.]+)/i;
      }
      const provider = isEversourceBill ? "EVERSOURCE" : "nationalgrid";
      const supply = extractValueFromText(text, supplyRegex);
      const delivery = extractValueFromText(text, deliveryRegex);
      let totalCharges = extractValueFromText(text, otherChargesRegex);

      if (!isEversourceBill) {
        // for NationalGrid bill, we get other charges.
        // So we have to calculate the total bill by taking sum of all the charges
        totalCharges = totalCharges + supply + delivery;
      }

      console.log("TOTAL", totalCharges);

      const formData = new FormData();
      formData.append("Pdf", jpgImage || "");
      formData.append("providerName", provider || "");
      formData.append("deliveryCharges", delivery?.toString());
      formData.append("supplyCharges", supply?.toString());
      formData.append("monthlyBill", totalCharges?.toString());
      // formData.append("Pdf", bill ?? "");
      // TODO: will upload PDF file in db and display here, for now due to short time I'm uploading the bill as image file

      // storing the bill file in DB
      const { data: response } = await uploadElectricBill(formData);
      console.log("Uploaded bill: ", response);

      setUploadedBill(response?.electricity_bill);
      // setUploadedBill("https://www.renewableenergyworld.com/wp-content/uploads/2017/06/REW_MakingSenseOfDemand1.png");

      // todo: handle update bill in redux with totalCharges
      // todo: replace billDate state with redux
      const uploadedBillData = {
        provider,
        supply,
        delivery,
        file: response?.electricity_bill,
      };

      // dispatch(saveBill(totalCharges));
      dispatch(saveBillDetails(uploadedBillData));
      onUpload?.(uploadedBillData);
    } catch (error: any) {
      toast.error(error);
    }
    setUploading(100);
  };

  const handleMoveToNextElement = () => {
    scrollToElement(analysisModuleId || "");
  };

  const isUploading = uploading > 0 && uploading < 100;

  return (
    <Box id={id}>
      <Typography variant='h2' mt={80} mb={10}>
        Electric Bill Upload
      </Typography>
      <Typography fontSize={16} mb={32} maxWidth={620}>
        Click to upload or drag & drop you bill here
      </Typography>

      <BorderedBox sx={{ paddingBlock: uploadedBill ? 24 : 100 }}>
        {uploadedBill ? (
          <Box
            display='flex'
            flexDirection='column'
            maxWidth={{ xs: "100%", sm: "650px" }}
            mx='auto'
          >
            <img
              src={uploadedBill}
              alt='Electric Bill'
              style={{ maxWidth: "100%", marginInline: "auto" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "100%", sm: 550 },
              marginInline: "auto",
              gap: 24,
              textAlign: "center",
            }}
          >
            <BillUploader imageFile={bill} onUpdate={handleSelectBill} />

            <Button sx={{ py: 5 }} onClick={handleMoveToNextElement}>
              <Typography variant='h6' fontSize={18} color='primary'>
                I don't have my bill now and will provide it latter
              </Typography>
            </Button>

            {!!bill && (
              <BillUploaderBox>
                <BillUploaderLoading sx={{ width: `${uploading}%` }} />
                <Description color='primary' sx={{ height: 47, width: 47 }} />
                <Box textAlign='left'>
                  <Typography
                    variant='h6'
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 440,
                    }}
                  >
                    {bill?.name || "Bill not selected"}
                  </Typography>
                  <Typography color='text.secondary' mt={8}>
                    {((bill?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB -{" "}
                    {uploading}% uploaded
                  </Typography>
                </Box>
              </BillUploaderBox>
            )}

            <CustomButton
              fullWidth
              onClick={handleBillUploading}
              disabled={isUploading || !bill}
            >
              {isUploading ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                "Continue"
              )}
            </CustomButton>
          </Box>
        )}
      </BorderedBox>
    </Box>
  );
};

export default ElectricBillUpload;
