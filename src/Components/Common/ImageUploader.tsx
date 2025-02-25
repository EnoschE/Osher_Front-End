import { Avatar, Box, IconButton } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { CancelOutlined } from "@mui/icons-material";

interface ImageUploaderProps {
  onUpdate: any;
  imageFile?: any;
  size?: number;
  isLogo?: boolean;
}

const ImageUploader = ({
  onUpdate,
  imageFile,
  size = 129,
  isLogo = false,
}: ImageUploaderProps) => {
  const colors = useSelector(selectColors);
  const inputRef = useRef<any>(null);

  const handleImageUploader = (event: any) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;
    if (selectedImage?.size > 1572864) {
      // Max image size set to 1.5MB, 1,048,576 * 1.5 = 1,572,864 Bytes
      // 1MB = 1,048,576 Bytes
      toast.error(
        "The selected image exceeds the maximum allowed size. Please choose a smaller image file."
      );
    } else {
      onUpdate(selectedImage);
    }
    event.target.value = null; // resetting the value of input
  };

  const handleRemoveImage = () => {
    onUpdate("");
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: isLogo ? size * 1.5 : size,
        height: isLogo ? size / 2 : size,
      }}
    >
      <input
        ref={inputRef}
        type='file'
        name='myImage'
        accept='image/png, image/jpeg, image/jpg'
        onChange={handleImageUploader}
        style={{ display: "none" }}
      />

      <Avatar
        sx={{
          cursor: "pointer",
          width: isLogo ? size * 1.5 : size,
          height: isLogo ? size / 2 : size,
          border: `1px solid ${colors.border}`,
          borderRadius: isLogo ? "10px" : "50%",
          padding: isLogo ? 2 : 0,
        }}
        src={
          typeof imageFile === "string"
            ? imageFile
            : imageFile instanceof Blob
            ? URL.createObjectURL(imageFile)
            : ""
        }
        onClick={() => inputRef?.current?.click()}
        imgProps={{ style: { objectFit: "cover" } }}
      />

      {!!imageFile && (
        <IconButton
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            p: 0,
            // bgcolor: "#ffffff",

            WebkitBackdropFilter: "saturate(200%) blur(8px)",
            backdropFilter: "saturate(200%) blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            transition: 'all ease 0.2s',

            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              // bgcolor: "#f6f6f6",
            },
          }}
          onClick={handleRemoveImage}
        >
          <CancelOutlined />
        </IconButton>
      )}
    </Box>
  );
};

export default ImageUploader;
