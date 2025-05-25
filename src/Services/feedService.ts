import { FeedAdsParams } from "../Components/Feed/Feed";
import http from "./httpService";

const apiEndpoint = "/feed";

// =====|  Feed Service  |=====

const FeedService = {
  getFeedData: () => http.get(`${apiEndpoint}/`),
  getAdsForFeed: (params: FeedAdsParams) =>
    http.post(`${apiEndpoint}/ads-for-feed`, params),
  getVideoAd: (params: FeedAdsParams) =>
    http.post(`${apiEndpoint}/video-ad`, params),
  incrementAdViews: (id: string) => http.put(`${apiEndpoint}/increment-ad-views/${id}`),
};

// =====|  APIs  |=====

export const getFeedData = () => {
  return FeedService.getFeedData();
};

export const getAdsForFeed = (params: FeedAdsParams) => {
  return FeedService.getAdsForFeed(params);
};

export const getVideoAd = (params: FeedAdsParams) => {
  return FeedService.getVideoAd(params);
};

export const incrementAdViews = (id: string) => {
  return FeedService.incrementAdViews(id);
};
