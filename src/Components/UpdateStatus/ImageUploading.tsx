import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BillUploader from "../WhyUs/BillUploader";
import { BillUploaderBox, BillUploaderLoading } from "../WhyUs/whyUsStyles";
import { Description } from "@mui/icons-material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import CustomButton from "../Common/CustomButton";
import { toast } from "react-toastify";

const ImageUploading = ({
  onImageUploading,
  uploadedImage,
}: {
  onImageUploading?: (file?: File) => void;
  uploadedImage?: string;
}) => {
  const colors = useSelector(selectColors);

  const [file, setFile] = useState<any>("");
  const [uploading, setUploading] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    setImageUrl(uploadedImage || "");
  }, [uploadedImage]);

  const handleSelectFile = (pdfFile: any) => {
    setFile(pdfFile);
  };

  const handleFileUploading = async () => {
    if (!file) return toast.error("Select file first!");

    setUploading(5);
    try {
      // updating the loading by 5% after every 1000ms
      setInterval(
        () => setUploading((state) => (state < 90 ? state + 5 : state)),
        1000
      );

      await onImageUploading?.(file);
    } catch (error: any) {
      toast.error(error);
    }
    setUploading(100);
  };

  const isUploading = uploading > 0 && uploading < 100;

  return imageUrl ? (
    <Box
      display='flex'
      flexDirection='column'
      maxWidth={{ xs: "100%", md: 560 }}
      mx='auto'
    >
      <img
        src={imageUrl}
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
        width: { xs: "100%", md: 560 },
        marginInline: "auto",
        gap: 24,
        textAlign: "center",
      }}
    >
      <BillUploader imageFile={file} onUpdate={handleSelectFile} />

      {!!file && (
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
              {file?.name || "Bill not selected"}
            </Typography>
            <Typography color='text.secondary' mt={8}>
              {((file?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB - {uploading}%
              uploaded
            </Typography>
          </Box>
        </BillUploaderBox>
      )}

      <CustomButton
        fullWidth
        onClick={handleFileUploading}
        disabled={isUploading || !file}
      >
        {isUploading ? (
          <CircularProgress size={20} color='inherit' />
        ) : (
          "Continue"
        )}
      </CustomButton>
    </Box>
  );
};

export default ImageUploading;
