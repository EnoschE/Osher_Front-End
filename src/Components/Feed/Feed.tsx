import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PageLayout from "../PageLayout/PageLayout";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { borderRadius } from "../../Utils/spacings";
import { getFeedData } from "../../Services/feedService";
import colors from "../../Utils/colors";
import FeedCard, { FeedCardItem } from "./FeedCard";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const { t } = useTranslation();
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
    } catch (error: any) {
      toast.error(t(error));
      console.error("Error fetching feed data:", error);
    }
    setLoading(false);
  };

  return (
    <PageLayout hideBackButton hideSidebar={!user._id}>
      {/* <AnimatedHeading heading={`Our Feed`} /> */}

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
          maxWidth: "600px",
          // mt: 20,
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
            <FeedCard isLoading animationDelay={0.1} />
          </>
        ) : (
          data?.map((item: FeedCardItem, index: number) => (
            <React.Fragment key={index}>
              <FeedCard key={index} item={item} animationDelay={index * 0.1} />
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
              {index === 1 ? (
                <>
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
                      bgcolor: "gray",
                      color: "white",
                    }}
                  >
                    <span>{t("AD will be displayed here")}</span>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: colors.border,
                      height: "1px",
                      width: "100%",
                      marginBlock: "52px",
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </React.Fragment>
          ))
        )}
      </Box>
    </PageLayout>
  );
};

export default Feed;
