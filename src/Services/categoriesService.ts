import http from "./httpService";

const apiEndpoint = "/categories";

// =====|  Categories Service  |=====

const CategoriesService = {
  getAllCategories: () => http.get(`${apiEndpoint}`),
};

// =====|  APIs  |=====

export const getAllCategories = () => {
  return CategoriesService.getAllCategories();
};
