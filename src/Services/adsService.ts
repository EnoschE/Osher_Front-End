import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/ads";

// =====|  Ads Service  |=====

const AdsService = {
  getAllAds: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
  getAdById: (id: string) =>
    http.get(`${apiEndpoint}/ad/${id}`, { headers: getAuthHeader() }),
  getAdsOfBrand: (brandId: string) =>
    http.get(`${apiEndpoint}/ads-of-brand/${brandId}`, {
      headers: getAuthHeader(),
    }),
  addAd: (data: any) =>
    http.post(`${apiEndpoint}/add-ad`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  editAd: (id: string, formData: any) =>
    http.put(`${apiEndpoint}/edit-ad/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  deleteAd: (id: string) =>
    http.delete(`${apiEndpoint}/delete-ad/${id}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const getAllAds = () => AdsService.getAllAds();

export const getAdById = (id: string) => AdsService.getAdById(id);

export const addAd = (data: any) => AdsService.addAd(data);

export const editAd = (id: string, formData: any) =>
  AdsService.editAd(id, formData);

export const deleteAd = (id: string) => AdsService.deleteAd(id);

export const getAdsOfBrand = (brandId: string) =>
  AdsService.getAdsOfBrand(brandId);
