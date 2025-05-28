import { Box, Skeleton, Typography } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import PostPicture from "../Common/PostPicture";
import { RoomOutlined } from "@mui/icons-material";

export type SpotCardItem = {
  _id: string;
  name: string;
  picture: string;
  information: string;
  location: string;
};

const SpotCard = ({
  item,
  isLoading,
  animationDelay,
}: {
  item?: SpotCardItem;
  isLoading?: boolean;
  animationDelay?: number;
}) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (item?._id) {
      const url = allRoutes.VIEW_SPOT;
      navigate(url.replace(":id", item?._id));
    }
  };

  return (
    <Box
      className='animated-block'
      position='relative'
      display='grid'
      gridTemplateColumns={{ sm: "1fr", md: "1.3fr 1fr" }}
      alignItems='center'
      gap='16px'
      width='100%'
      sx={{ animationDelay: `${animationDelay}s` }}
    >
      <PostPicture
        src={item?.picture}
        onClick={handlePostClick}
        aspectRatio={"1.2"}
        objectFit='cover'
      />

      {isLoading ? (
        <Box>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant='text'
              width={index === 3 ? "85%" : "100%"}
              height={16}
              sx={{ borderRadius: borderRadius.sm }}
            />
          ))}
        </Box>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='flex-start'
          gap={18}
          onClick={handlePostClick}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant='h3' fontWeight={500}>
            {item?.name}
          </Typography>
          {/* <Typography
            color='text.secondary'
            whiteSpace='pre-wrap'
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item?.information}
          </Typography> */}
          <Typography>
            <RoomOutlined sx={{ width: 14, height: 14, mr: 4, mb: "-2px" }} />
            {item?.location}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SpotCard;
