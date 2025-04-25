import http from "./httpService";

const apiEndpoint = "/feed";

// =====|  Feed Service  |=====

const FeedService = {
  getFeedData: () =>
    http.get(
      `${apiEndpoint}/`,
      // { headers: getAuthHeader() }
    ),
};

// =====|  APIs  |=====

export const getFeedData = () => {
  return FeedService.getFeedData();
};
