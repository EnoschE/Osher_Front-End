import http from "./httpService";

const apiEndpoint = "/feed";

// =====|  Feed Service  |=====

const FeedService = {
  getFeedData: () => http.get(`${apiEndpoint}/`),
  getAdsForFeed: () => http.get(`${apiEndpoint}/ads-for-feed`),
};

// =====|  APIs  |=====

export const getFeedData = () => {
  return FeedService.getFeedData();
};

export const getAdsForFeed = () => {
  return FeedService.getAdsForFeed();
};
