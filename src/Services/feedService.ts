import { FeedAdsParams } from "../Components/Feed/Feed";
import http from "./httpService";

const apiEndpoint = "/feed";

// =====|  Feed Service  |=====

const FeedService = {
  getFeedData: () => http.get(`${apiEndpoint}/`),
  getAdsForFeed: (params: FeedAdsParams) =>
    http.post(`${apiEndpoint}/ads-for-feed`, params),
};

// =====|  APIs  |=====

export const getFeedData = () => {
  return FeedService.getFeedData();
};

export const getAdsForFeed = (params: FeedAdsParams) => {
  return FeedService.getAdsForFeed(params);
};
