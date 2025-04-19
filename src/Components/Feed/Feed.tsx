import { useEffect, useState } from "react";
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

type FeedCardItem = {
  name: string;
  picture: string;
  userName: string;
  userPicture: string;
  description: string;
  publishDate: string;
};

const FeedCard = ({ item }: { item: FeedCardItem }) => {
  return (
    <Box display='flex' flexDirection='column' gap='18px' width='100%'>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        gap='12px'
      >
        <AvatarWithName
          picture={item.userPicture}
          name={item.userName}
          fontWeight={600}
        />
        <Typography color='text.secondary'>
          {moment(item.publishDate).fromNow()}
        </Typography>
      </Box>
      <Box
        component='img'
        src={item.picture}
        sx={{
          maxWidth: "100%",
          width: "100%",
          objectFit: "contain",
          borderRadius: borderRadius.xl,
          border: `0.5px solid ${colors.border}`,
        }}
      />
      <Typography fontWeight={500}>
        <Typography component='span' fontWeight={600}>
          {item.userName}
        </Typography>
        {": "}
        {item.name}
      </Typography>
      <Typography color='text.secondary'>{item.description}</Typography>
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

  console.log("DAT", data);

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
          <>
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
          </>
        ))}
      </Box>
    </PageLayout>
  );
};

export default Feed;
