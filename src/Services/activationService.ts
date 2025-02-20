import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/activation";

// =====|  Activation Service  |=====

const ActivationService = {
	getActivationStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateActivationStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getActivationStatus = (userId: string) => {
	return ActivationService.getActivationStatus(userId);
};

export const updateActivationStatus = (formData: FormData) => {
	return ActivationService.updateActivationStatus(formData);
};
