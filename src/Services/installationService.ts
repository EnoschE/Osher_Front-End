import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/installation";

// =====|  Installation Service  |=====

const InstallationService = {
	getInstallationStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateInstallationStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getInstallationStatus = (userId: string) => {
	return InstallationService.getInstallationStatus(userId);
};

export const updateInstallationStatus = (formData: FormData) => {
	return InstallationService.updateInstallationStatus(formData);
};
