import { Box, Typography } from "@mui/material";
import CustomAvatar from "./CustomAvatar";
import ArrowButton from "./ArrowButton";

const AvatarWithName = ({
  name,
  picture,
  onClick,
  fontWeight = 400,
  isSquarish,
}: {
  name: string;
  picture: string;
  fontWeight?: number;
  isSquarish?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Box display='flex' alignItems='center' gap={8}>
      <CustomAvatar src={picture} isSquarish={isSquarish} />
      <Typography fontWeight={fontWeight}>{name}</Typography>

      {!!onClick && <ArrowButton onClick={onClick} />}
    </Box>
  );
};

export default AvatarWithName;
