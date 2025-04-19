import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/feed";

// =====|  Feed Service  |=====

const FeedService = {
  getFeedData: () =>
    http.get(
      `${apiEndpoint}/`
      // { headers: getAuthHeader() }
    ),
};

// =====|  APIs  |=====

export const getFeedData = () => {
  return FeedService.getFeedData();
};
