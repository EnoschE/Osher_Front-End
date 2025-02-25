import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/brands";

// =====|  Brands Service  |=====

const BrandsService = {
  getAllBrands: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
  getBrandById: (id: string) =>
    http.get(`${apiEndpoint}/brand/${id}`, { headers: getAuthHeader() }),
  addBrand: (data: any) =>
    http.post(`${apiEndpoint}/add-brand`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  editBrand: (id: string, formData: any) =>
    http.put(`${apiEndpoint}/edit-brand/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  deleteBrand: (id: string) =>
    http.delete(`${apiEndpoint}/delete-brand/${id}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const getAllBrands = () => BrandsService.getAllBrands();

export const getBrandById = (id: string) => BrandsService.getBrandById(id);

export const addBrand = (data: any) => BrandsService.addBrand(data);

export const editBrand = (id: string, formData: any) =>
  BrandsService.editBrand(id, formData);

export const deleteBrand = (id: string) => BrandsService.deleteBrand(id);
