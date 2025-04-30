import { Avatar, Box, IconButton, SxProps } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import { CancelOutlined, PanoramaOutlined } from "@mui/icons-material";
import colors from "../../Utils/colors";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../Utils/spacings";

interface ImageUploaderProps {
  onUpdate: any;
  imageFile?: any;
  className?: string;
  sx?: SxProps;
  isSquarish?: boolean;
}

const ImageUploader = ({
  onUpdate,
  imageFile,
  className,
  sx,
  isSquarish,
}: ImageUploaderProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);
  const size = isSquarish ? 240 : 134;

  const handleImageUploader = (event: any) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;
    if (selectedImage?.size > 2572864) {
      // Max image size set to 2.5MB, 1,048,576 * 1.5 = 1,572,864 Bytes
      // 1MB = 1,048,576 Bytes
      toast.error(
        t(
          "The selected image exceeds the maximum allowed size. Please choose a smaller image file."
        )
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
      className={className}
      sx={{
        position: "relative",
        width: size,
        height: isSquarish ? (imageFile ? "auto" : size) : size,
        borderRadius: borderRadius.xl,
        ...sx,
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
          width: size,
          height: isSquarish ? (imageFile ? "max-content" : size) : size,
          border: `1px solid ${colors.border}`,
          borderRadius: isSquarish ? borderRadius.xl : "50%",
          padding: 0,
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
      >
        {isSquarish && !imageFile && <PanoramaOutlined sx={{ fontSize: 57 }} />}
      </Avatar>

      {!!imageFile && (
        <IconButton
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            p: 0,
            WebkitBackdropFilter: "saturate(200%) blur(8px)",
            backdropFilter: "saturate(200%) blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            transition: "all ease 0.2s",

            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.5)",
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
