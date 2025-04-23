import React, { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { borderRadius } from "../../Utils/spacings";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { getFeedData } from "../../Services/feedService";
import colors from "../../Utils/colors";
import moment from "moment";
import PostPicture from "../Common/PostPicture";
import CustomAvatar from "../Common/CustomAvatar";

type FeedCardItem = {
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
}: {
  item?: FeedCardItem;
  isLoading?: boolean;
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
          backgroundColor: "rgba(256,256,256, 0.5)",
          // backgroundColor: "rgba(0,0,0, 0.3)",
          borderRadius: borderRadius.lg,
          cursor: "pointer",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "rgba(256,256,256, 0.5)",
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
            <Typography
              // color='white'
              variant='h6'
            >
              {item?.userName}
            </Typography>
          )}
          {!isLoading && (
            <Typography
              // color='lightgray'
              // color='text.secondary'
              variant='body2'
            >
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
          <Typography color='text.secondary' whiteSpace='pre-wrap'>
            {item?.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const Feed = () => {
  const user = useSelector(selectUser);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getFeedData();
      setData(response);
    } catch (error) {
      console.error("Error fetching feed data:", error);
    }
    setLoading(false);
  };

  return (
    <PageLayout hideBackButton hideSidebar={!user._id}>
      <Box
        // className='animated-block'
        sx={{
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "12px",
          gap: "20px",
          maxWidth: "600px",
        }}
      >
        {loading ? (
          <>
            <FeedCard isLoading />
            <Box
              sx={{
                backgroundColor: colors.border,
                height: "1px",
                width: "100%",
                marginBlock: "52px",
              }}
            />
            <FeedCard isLoading />
          </>
        ) : (
          data?.map((item: FeedCardItem, index: number) => (
            <React.Fragment key={index}>
              <FeedCard key={index} item={item} />
              {index !== data?.length - 1 && (
                <Box
                  sx={{
                    backgroundColor: colors.border,
                    height: "1px",
                    width: "100%",
                    marginBlock: "52px",
                  }}
                />
              )}
            </React.Fragment>
          ))
        )}
      </Box>
    </PageLayout>
  );
};

export default Feed;
