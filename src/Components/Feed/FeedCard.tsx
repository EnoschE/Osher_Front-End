import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import moment from "moment";
import PostPicture from "../Common/PostPicture";
import CustomAvatar from "../Common/CustomAvatar";
import { frostedGlassEffect } from "../../Utils/colors";

export type FeedCardItem = {
  _id: string;
  name: string;
  picture: string;
  userName: string;
  userId: string;
  userPicture: string;
  brandName: string;
  brandId: string;
  brandPicture: string;
  description: string;
  publishDate: string;
};

const FeedCard = ({
  item,
  isLoading,
  isAdCard,
  animationDelay,
}: {
  item?: FeedCardItem;
  isLoading?: boolean;
  isAdCard?: boolean;
  animationDelay?: number;
}) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (item?._id) {
      const url = isAdCard ? allRoutes.VIEW_AD : allRoutes.VIEW_POST;
      navigate(url.replace(":id", item?._id));
    }
  };

  const handleAvatarClick = () => {
    if (isAdCard && item?.brandId) {
      navigate(allRoutes.VIEW_BRAND.replace(":id", item?.brandId));
    }
    if (item?.userId)
      navigate(allRoutes.VIEW_INFLUENCER.replace(":id", item?.userId));
  };

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
          ...frostedGlassEffect,
          backgroundColor: "rgba(256,256,256, 0.65)",
          borderRadius: borderRadius.lg,
          cursor: "pointer",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "rgba(256,256,256, 0.75)",
          },
        }}
        onClick={handleAvatarClick}
      >
        <CustomAvatar
          src={isAdCard ? item?.brandPicture : item?.userPicture}
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
            <Typography variant='h6'>
              {isAdCard ? item?.brandName : item?.userName}
            </Typography>
          )}
          {!isLoading && (
            <Typography variant='body2'>
              {moment(item?.publishDate).fromNow()}
            </Typography>
          )}
        </Box>
      </Box>

      {isAdCard && (
        <Chip
          label='AD'
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 1,
            ...frostedGlassEffect,
            backgroundColor: "rgba(256,256,256, 0.65)",
          }}
        />
      )}

      <PostPicture
        src={item?.picture}
        onClick={handlePostClick}
        aspectRatio={isAdCard ? "unset" : "1.55"}
        objectFit={isAdCard ? "contain" : "cover"}
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
        <Box
          display='flex'
          flexDirection='column'
          gap={8}
          onClick={handlePostClick}
          sx={{ cursor: "pointer" }}
        >
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
