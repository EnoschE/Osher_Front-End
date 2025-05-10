import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { borderRadius } from "../../Utils/spacings";
import { getAdsForFeed, getFeedData } from "../../Services/feedService";
import colors from "../../Utils/colors";
import FeedCard, { FeedCardItem } from "./FeedCard";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        borderRadius: borderRadius.xl,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 450,
        boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
        bgcolor: "darkgrey",
        color: "white",
      }}
    >
      <span>{t("AD will be displayed here")}</span>
    </Box>
  );
};

const FeedDivider = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.border,
        height: "1px",
        width: "100%",
        marginBlock: "32px",
      }}
    />
  );
};

const Feed = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response: any = await getFeedData();
      setPosts(response);
    } catch (error: any) {
      toast.error(t(error));
      console.error("Error fetching feed posts:", error);
    }
    setLoading(false);
  };

  const fetchAds = async () => {
    try {
      const response: any = await getAdsForFeed();
      setAds(response);
    } catch (error: any) {
      toast.error(t(error));
      console.error("Error fetching feed Ads:", error);
    }
  };

  return (
    <PageLayout hideSidebar={!user._id}>
      <Box
        sx={{
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "12px",
          gap: "20px",
          maxWidth: "500px",
        }}
      >
        {loading ? (
          <>
            <FeedCard isLoading />
            <FeedDivider />
            <FeedCard isLoading animationDelay={0.1} />
          </>
        ) : (
          posts?.map((item: FeedCardItem, index: number) => {
            const adAfterEveryPosts = 2;
            const showAd = (index + 1) % adAfterEveryPosts === 0;
            const adIndex = Math.floor(index / adAfterEveryPosts);
            return (
              <React.Fragment key={index}>
                <FeedCard item={item} animationDelay={index * 0.1} />

                {showAd && (
                  <>
                    <FeedDivider />
                    {ads[adIndex] ? (
                      <FeedCard item={ads[adIndex]} isAdCard />
                    ) : (
                      <AdPlaceholder />
                    )}
                  </>
                )}

                {index !== posts.length - 1 && <FeedDivider />}
              </React.Fragment>
            );
          })
        )}
      </Box>
    </PageLayout>
  );
};

export default Feed;
