import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/interconnection";

// =====|  Utility interconnection Service  |=====

const UtilityInterconnectionService = {
	getInterconnectionStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateInterconnectionStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getInterconnectionStatus = (userId: string) => {
	return UtilityInterconnectionService.getInterconnectionStatus(userId);
};

export const updateInterconnectionStatus = (formData: FormData) => {
	return UtilityInterconnectionService.updateInterconnectionStatus(formData);
};
