import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/spots";

// =====|  Spots Service  |=====

const SpotsService = {
  getAllSpots: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
  getSpotById: (id: string) =>
    http.get(`${apiEndpoint}/spot/${id}`, { headers: getAuthHeader() }),
  addSpot: (data: any) =>
    http.post(`${apiEndpoint}/add-spot`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  editSpot: (id: string, formData: any) =>
    http.put(`${apiEndpoint}/edit-spot/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  deleteSpot: (id: string) =>
    http.delete(`${apiEndpoint}/delete-spot/${id}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const getAllSpots = () => SpotsService.getAllSpots();

export const getSpotById = (id: string) => SpotsService.getSpotById(id);

export const addSpot = (data: any) => SpotsService.addSpot(data);

export const editSpot = (id: string, formData: any) =>
  SpotsService.editSpot(id, formData);

export const deleteSpot = (id: string) => SpotsService.deleteSpot(id);
