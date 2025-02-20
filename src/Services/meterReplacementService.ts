import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/meter-replacement";

// =====|  Meter Replacement Service  |=====

const MeterReplacementService = {
	getMeterReplacementStatus: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateMeterReplacementStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getMeterReplacementStatus = (userId: string) => {
	return MeterReplacementService.getMeterReplacementStatus(userId);
};

export const updateMeterReplacementStatus = (formData: FormData) => {
	return MeterReplacementService.updateMeterReplacementStatus(formData);
};
