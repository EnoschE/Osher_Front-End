import React, { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import AnimatedHeading from "../Common/AnimatedHeading";
import { borderRadius } from "../../Utils/spacings";
import ArrowButton from "../Common/ArrowButton";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import {
  fetchDashboardData,
  selectDashboardData,
} from "../../Redux/Slices/dashboardSlice";
import { getFeedData } from "../../Services/feedService";
import AvatarWithName from "../Common/AvatarWithName";
import colors from "../../Utils/colors";
import moment from "moment";
import PostPicture from "../Common/PostPicture";
import CustomAvatar from "../Common/CustomAvatar";

type FeedCardItem = {
  name: string;
  picture: string;
  userName: string;
  userId: string;
  userPicture: string;
  description: string;
  publishDate: string;
};

const FeedCard = ({ item }: { item: FeedCardItem }) => {
  const navigate = useNavigate();

  return (
    <Box
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
          backgroundColor: "rgba(0,0,0, 0.3)",
          borderRadius: borderRadius.lg,
          cursor: "pointer",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "rgba(0,0,0, 0.5)",
          },
        }}
        onClick={() =>
          navigate(allRoutes.VIEW_INFLUENCER.replace(":id", item.userId))
        }
      >
        <CustomAvatar src={item.userPicture} size='sm' />
        <Box display='flex' flexDirection='column'>
          <Typography color='white' variant='h6'>
            {item.userName}
          </Typography>
          <Typography color='lightgray' variant='body2'>
            {moment(item.publishDate).fromNow()}
          </Typography>
        </Box>
      </Box>

      <PostPicture src={item.picture} />
      
      <Box display='flex'flexDirection='column' gap={8}>
        <Typography fontWeight={500}>
          {/* <Typography component='span' fontWeight={600}>
          {item.userName}
          </Typography>
          {": "} */}
          {item.name}
        </Typography>
        <Typography color='text.secondary'>{item.description}</Typography>
      </Box>
    </Box>
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const dashboardData = useSelector(selectDashboardData);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dispatch(fetchDashboardData());
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
    <PageLayout loading={loading} hideBackButton>
      <Box
        className='animated-block'
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
        {data?.map((item: FeedCardItem, index: number) => (
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
        ))}
      </Box>
    </PageLayout>
  );
};

export default Feed;
