import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/technician";

const TechnicianService = {
	registerNewTechnician: (data: any) =>
		http.post(`${apiEndpoint}/register-technician`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),

	getTechnicianSiteSchedules: (technicianId: string) =>
		http.get(`${apiEndpoint}/site-schedules/${technicianId}`, {
			headers: { ...getAuthHeader() },
		}),
};

export const registerNewTechnician = (data: any) => {
	return TechnicianService.registerNewTechnician(data);
};

export const getTechnicianSiteSchedules = (technicianId: string) => {
	return TechnicianService.getTechnicianSiteSchedules(technicianId);
};
