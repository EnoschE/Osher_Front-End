import { Box, IconButton, Typography } from "@mui/material";
import CustomAvatar from "./CustomAvatar";
import { ArrowOutward } from "@mui/icons-material";
import ArrowButton from "./ArrowButton";

const AvatarWithName = ({
  name,
  picture,
  onClick,
}: {
  name: string;
  picture: string;
  onClick?: () => void;
}) => {
  return (
    <Box display='flex' alignItems='center' gap={8}>
      <CustomAvatar src={picture} />
      <Typography>{name}</Typography>

      {!!onClick && <ArrowButton onClick={onClick} />}
    </Box>
  );
};

export default AvatarWithName;
