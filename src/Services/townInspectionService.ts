import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/town-inspection";

// =====|  TowInspection Service  |=====

const TowInspectionService = {
	getTowInspectionStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateTowInspectionStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getTowInspectionStatus = (userId: string) => {
	return TowInspectionService.getTowInspectionStatus(userId);
};

export const updateTowInspectionStatus = (formData: FormData) => {
	return TowInspectionService.updateTowInspectionStatus(formData);
};
