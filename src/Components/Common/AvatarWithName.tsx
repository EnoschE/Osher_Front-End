import { Box, IconButton, Typography } from "@mui/material";
import CustomAvatar from "./CustomAvatar";
import { ArrowOutward } from "@mui/icons-material";

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

      {!!onClick && (
        <IconButton size='small' sx={{ p: 3 }} onClick={onClick}>
          <ArrowOutward fontSize='small' color='primary' />
        </IconButton>
      )}
    </Box>
  );
};

export default AvatarWithName;
