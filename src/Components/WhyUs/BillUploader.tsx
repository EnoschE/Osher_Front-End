import { Typography } from "@mui/material";
import { ReactNode, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { BorderedBox } from "./whyUsStyles";
import useLoginStyles from "../Login/loginStyles";
import { CloudUploadOutlined } from "@mui/icons-material";
import { borderRadius } from "../../Utils/spacings";

interface BillUploaderProps {
  onUpdate: any;
  imageFile?: any;
  size?: string | number;
}

interface DashedBoxProps {
  children: ReactNode;
  onClick?: any;
  onDragOver?: any;
  onDrop?: any;
  onDragEnter?: any;
  onDragLeave?: any;
  isDragging: boolean;
}

const DashedBox = ({
  children,
  onDragEnter,
  onDragLeave,
  isDragging,
  ...rest
}: DashedBoxProps) => {
  const colors = useSelector(selectColors);

  return (
    <BorderedBox
      sx={{
        borderStyle: "dashed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBlock: 34,
        gap: 14,
        width: "100%",
        cursor: "pointer",
        transition: "all ease 0.15s",
        borderRadius: borderRadius.sm,
        backgroundColor: isDragging ? colors.lightGray : "white", // Set the background color based on isDragging
        "&:hover": {
          bgcolor: colors.lightGray,
        },
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      {...rest}
    >
      {children}
    </BorderedBox>
  );
};

const BillUploader = ({ onUpdate }: BillUploaderProps) => {
  const colors = useSelector(selectColors);
  const { IconSquareBox } = useLoginStyles();

  const inputRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBillUploader = (event: any) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;
    if (selectedImage?.size > 10485760) {
      toast.error(
        "The selected image exceeds the maximum allowed size. Please choose a smaller image file."
      );
    } else {
      onUpdate(selectedImage);
    }
    event.target.value = null; // Resetting the value of the input
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true); // Set isDragging to true when a file is dragged over the box
  };

  const handleDragLeave = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false); // Set isDragging to false when a file is dragged out of the box
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];

      // Check if the dropped file is a PNG/JPEG
      if (["image/jpeg", "image/png"].includes(selectedFile.type)) {
        if (selectedFile.size > 10485760) {
          toast.error(
            "The dropped file exceeds the maximum allowed size. Please choose a smaller file."
          );
        } else {
          onUpdate(selectedFile);
        }
      } else {
        toast.error("Please drop a PNG, JPEG or JPG file.");
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        name='myImage'
        accept='image/*'
        // accept="application/pdf"
        onChange={handleBillUploader}
        style={{ display: "none" }}
      />

      <DashedBox
        onClick={() => inputRef?.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isDragging={isDragging} // Pass the isDragging state to the DashedBox component
      >
        <>
          <IconSquareBox>
            <CloudUploadOutlined />
          </IconSquareBox>
          <Typography variant='h6' fontSize={18} mt={4}>
            <Typography component='span' variant='inherit' color='primary.main'>
              Click to upload
            </Typography>{" "}
            or drag and drop PNG, JPEG
          </Typography>
          <Typography variant='h6' fontWeight={400} color='text.secondary'>
            (max size of design is 800x400px)
          </Typography>
        </>
      </DashedBox>
    </>
  );
};

export default BillUploader;
