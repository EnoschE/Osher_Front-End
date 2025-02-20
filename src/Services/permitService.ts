import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/permit";

// =====|  Permit Application Service  |=====

const PermitApplicationService = {
	getPermitStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updatePermitStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getPermitStatus = (userId: string) => {
	return PermitApplicationService.getPermitStatus(userId);
};

export const updatePermitStatus = (formData: FormData) => {
	return PermitApplicationService.updatePermitStatus(formData);
};
