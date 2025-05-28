import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import FeedDivider from "../Feed/FeedDivider";
import SpotCard, { SpotCardItem } from "./SpotCard";
import { getAllSpots } from "../../Services/spotsService";

const ExploreSpots = () => {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Array<SpotCardItem>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // TODO: important - work on infinite scroll pagination

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response: any = await getAllSpots();
      setPosts(response);
    } catch (error: any) {
      toast.error(t(error));
      console.error("Error fetching feed spots:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout hideSidebar>
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
            <SpotCard isLoading />
            <FeedDivider />
            <SpotCard isLoading animationDelay={0.1} />
          </>
        ) : (
          posts.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <SpotCard item={item} animationDelay={index * 0.1} />
                {index !== posts.length - 1 && <FeedDivider />}
              </React.Fragment>
            );
          })
        )}
      </Box>
    </PageLayout>
  );
};

export default ExploreSpots;
