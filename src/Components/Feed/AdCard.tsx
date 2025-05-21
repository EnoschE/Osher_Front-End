import React, { useEffect, useRef } from "react";
import FeedCard, { FeedCardItem } from "./FeedCard";
import { Box } from "@mui/material";

interface AdCardProps {
  item: FeedCardItem;
  hasViewed: boolean;
  onView: (adId: string) => void;
}

const AdCard: React.FC<AdCardProps> = ({ item, hasViewed, onView }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || hasViewed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onView(item._id);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [hasViewed, item._id, onView]);

  return (
    <Box ref={ref} width='100%'>
      <FeedCard item={item} isAdCard />
    </Box>
  );
};

export default AdCard;
