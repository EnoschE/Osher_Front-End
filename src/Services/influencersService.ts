import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/influencers";

// =====|  Influencer Service  |=====

const InfluencerService = {
  getAllInfluencers: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
  getInfluencerById: (id: string) =>
    http.get(`${apiEndpoint}/influencer/${id}`, { headers: getAuthHeader() }),
  addInfluencer: (data: any) =>
    http.post(`${apiEndpoint}/add-influencer`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  editInfluencer: (id: string, formData: any) =>
    http.put(`${apiEndpoint}/edit-influencer/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  deleteInfluencer: (id: string) =>
    http.delete(`${apiEndpoint}/delete-influencer/${id}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const getAllInfluencers = () => InfluencerService.getAllInfluencers();

export const getInfluencerById = (id: string) => InfluencerService.getInfluencerById(id);

export const addInfluencer = (data: any) => InfluencerService.addInfluencer(data);

export const editInfluencer = (id: string, formData: any) =>
  InfluencerService.editInfluencer(id, formData);

export const deleteInfluencer = (id: string) => InfluencerService.deleteInfluencer(id);
