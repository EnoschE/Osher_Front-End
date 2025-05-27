import { Avatar, Box, IconButton, SxProps } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import { CancelOutlined, PanoramaOutlined } from "@mui/icons-material";
import colors from "../../Utils/colors";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../Utils/spacings";

interface ImageUploaderProps {
  onUpdate: (file: any) => void;
  imageFile?: any;
  className?: string;
  sx?: SxProps;
  isSquarish?: boolean;
  allowVideoUpload?: boolean;
  allowOnlyVideo?: boolean;
}

const ImageUploader = ({
  onUpdate,
  imageFile,
  className,
  sx,
  isSquarish,
  allowVideoUpload = false,
  allowOnlyVideo = false,
}: ImageUploaderProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const size = isSquarish ? 240 : 134;

  // TODO: allow images of IOS/iPhone (HEIC) for future

  const handleImageUploader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const isVideo = selectedFile.type.startsWith("video/");
    const isImage = selectedFile.type.startsWith("image/");

    if (allowOnlyVideo && !isVideo) {
      toast.error(t("Please select a valid video file."));
      return;
    }

    if (!isImage && !isVideo) {
      toast.error(t("Please select a valid image or video file."));
      return;
    }

    const maxSizeInBytes = isVideo ? 10 * 1024 * 1024 : 2.5 * 1024 * 1024; // 10MB or 2.5MB

    if (selectedFile.size > maxSizeInBytes) {
      toast.error(
        t(
          `The selected file exceeds the maximum allowed size of ${
            isVideo ? "10MB" : "2.5MB"
          }. Please choose a smaller file.`
        )
      );
      event.target.value = ""; // reset input
      return;
    }

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);

        const maxVideoLength = 30;

        if (video.duration > maxVideoLength) {
          toast.error(
            t(`The video must be ${maxVideoLength} seconds or shorter.`)
          );
        } else {
          onUpdate(selectedFile);
        }

        event.target.value = ""; // reset input
      };

      video.onerror = () => {
        toast.error(
          t("Failed to load the video. Please try a different file.")
        );
        event.target.value = ""; // reset input
      };

      video.src = URL.createObjectURL(selectedFile);
    } else {
      onUpdate(selectedFile);
      event.target.value = ""; // reset input
    }
  };

  const handleRemoveImage = () => {
    onUpdate("");
  };

  const fileUrl =
    typeof imageFile === "string"
      ? imageFile
      : imageFile instanceof Blob
      ? URL.createObjectURL(imageFile)
      : "";

  const isVideo =
    fileUrl &&
    (imageFile instanceof Blob ? imageFile.type.startsWith("video/") : false);

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
        accept={
          allowOnlyVideo
            ? "video/mp4, video/webm, video/quicktime, .mov"
            : allowVideoUpload
            ? "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/quicktime, .mov"
            : "image/png, image/jpeg, image/jpg"
        }
        onChange={handleImageUploader}
        style={{ display: "none" }}
      />

      {isVideo ? (
        <video
          src={fileUrl}
          controls
          style={{
            width: size,
            height: isSquarish ? "auto" : size,
            borderRadius: isSquarish ? borderRadius.xl : "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => inputRef?.current?.click()}
          autoPlay
        />
      ) : (
        <Avatar
          sx={{
            cursor: "pointer",
            width: size,
            height: isSquarish ? (imageFile ? "max-content" : size) : size,
            border: `1px solid ${colors.border}`,
            borderRadius: isSquarish ? borderRadius.xl : "50%",
            padding: 0,
          }}
          src={fileUrl}
          onClick={() => inputRef?.current?.click()}
          imgProps={{ style: { objectFit: "cover" } }}
        >
          {isSquarish && !imageFile && (
            <PanoramaOutlined sx={{ fontSize: 57 }} />
          )}
        </Avatar>
      )}

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
