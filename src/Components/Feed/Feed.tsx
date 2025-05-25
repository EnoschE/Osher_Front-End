import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { getFeedData, incrementAdViews } from "../../Services/feedService";
import FeedCard, { FeedCardItem } from "./FeedCard";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import AdPlaceholder from "./AdPlaceholder";
import FeedDivider from "./FeedDivider";
import { useFeedAdsWatcher } from "../../Hooks/useFeedAdsWatcher";
import AdCard from "./AdCard";

export interface FeedAdsParams {
  state?: string;
  time?: number;
  day?: string;
}

const Feed = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const ads = useFeedAdsWatcher();

  const [posts, setPosts] = useState<Array<FeedCardItem>>([]);
  const [loading, setLoading] = useState(false);
  const viewedAdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  // TODO: important - work on infinite scroll pagination

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response: any = await getFeedData();
      setPosts(response);
    } catch (error: any) {
      toast.error(t(error));
      console.error("Error fetching feed posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdViewIncrement = async (adId: string) => {
    try {
      await incrementAdViews(adId);
    } catch (error) {
      console.error("Failed to increment ad view:", error);
    }
  };

  const handleAdView = (adId: string) => {
    if (!viewedAdsRef.current.has(adId)) {
      viewedAdsRef.current.add(adId);
      handleAdViewIncrement(adId);
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
          posts.map((item, index) => {
            const adAfterEveryPosts = 2;
            const showAd = (index + 1) % adAfterEveryPosts === 0;
            const adIndex = ads.length
              ? Math.floor((index + 1) / adAfterEveryPosts) % ads.length
              : 0;
            const ad = ads.length ? ads[adIndex] : null;

            return (
              <React.Fragment key={index}>
                <FeedCard item={item} animationDelay={index * 0.1} />
                {showAd && (
                  <>
                    <FeedDivider />
                    {ad ? (
                      <AdCard
                        item={ad}
                        hasViewed={viewedAdsRef.current?.has(ad._id)}
                        onView={handleAdView}
                      />
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
