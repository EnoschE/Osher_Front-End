import { Box, Skeleton, Typography } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import moment from "moment";
import PostPicture from "../Common/PostPicture";
import CustomAvatar from "../Common/CustomAvatar";

export type FeedCardItem = {
  _id: string;
  name: string;
  picture: string;
  userName: string;
  userId: string;
  userPicture: string;
  description: string;
  publishDate: string;
};

const FeedCard = ({
  item,
  isLoading,
  animationDelay,
}: {
  item?: FeedCardItem;
  isLoading?: boolean;
  animationDelay?: number;
}) => {
  const navigate = useNavigate();

  return (
    <Box
      className='animated-block'
      position='relative'
      display='flex'
      flexDirection='column'
      gap='28px'
      width='100%'
      sx={{ animationDelay: `${animationDelay}s` }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: "8px",
          left: "8px",
          gap: "8px",
          padding: "8px 12px",
          zIndex: 1,
          WebkitBackdropFilter: "blur(12px) saturate(200%)",
          backdropFilter: "blur(12px) saturate(200%)",
          backgroundColor: "rgba(256,256,256, 0.65)",
          // backgroundColor: "rgba(0,0,0, 0.3)",
          borderRadius: borderRadius.lg,
          cursor: "pointer",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "rgba(256,256,256, 0.75)",
          },
        }}
        onClick={() =>
          item?.userId
            ? navigate(allRoutes.VIEW_INFLUENCER.replace(":id", item?.userId))
            : undefined
        }
      >
        <CustomAvatar
          src={item?.userPicture}
          size='sm'
          showLoader={isLoading}
        />
        <Box display='flex' flexDirection='column'>
          {isLoading ? (
            <Skeleton
              variant='text'
              width={100}
              height={16}
              sx={{ borderRadius: borderRadius.sm }}
            />
          ) : (
            <Typography variant='h6'>{item?.userName}</Typography>
          )}
          {!isLoading && (
            <Typography variant='body2'>
              {moment(item?.publishDate).fromNow()}
            </Typography>
          )}
        </Box>
      </Box>

      <PostPicture
        src={item?.picture}
        onClick={() =>
          navigate(allRoutes.VIEW_POST.replace(":id", item?._id || ""))
        }
      />

      {isLoading ? (
        <Box>
          <Skeleton
            variant='text'
            width='100%'
            height={16}
            sx={{ borderRadius: borderRadius.sm }}
          />
          <Skeleton
            variant='text'
            width='100%'
            height={16}
            sx={{ borderRadius: borderRadius.sm }}
          />
          <Skeleton
            variant='text'
            width='100%'
            height={16}
            sx={{ borderRadius: borderRadius.sm }}
          />
          <Skeleton
            variant='text'
            width='85%'
            height={16}
            sx={{ borderRadius: borderRadius.sm }}
          />
        </Box>
      ) : (
        <Box display='flex' flexDirection='column' gap={8}>
          <Typography fontWeight={500}>{item?.name}</Typography>
          <Typography
            color='text.secondary'
            whiteSpace='pre-wrap'
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item?.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FeedCard;
