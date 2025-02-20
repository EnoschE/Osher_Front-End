import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/site-survey";

// =====|  Profile Service  |=====

const ProfileService = {
	getAllAppointments: () => http.get(`${apiEndpoint}/all-appointments`, { headers: getAuthHeader() }),
	getAppointmentByUserId: (userId: string) =>
		http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	getAppointmentDetails: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
	assignTechnician: () => http.post(`${apiEndpoint}/assign-site-technician`, {}, { headers: getAuthHeader() }),
	getAvailableSlotsOfTechnician: (technicianId: string, date: string) =>
		http.get(`${apiEndpoint}/available-slots/${technicianId}/${date}`, { headers: getAuthHeader() }),
	bookSiteSurvey: (data: any) => http.post(`${apiEndpoint}/book-site-survey`, data, { headers: getAuthHeader() }),
	updateSiteSurvey: (id: string, data: any) =>
		http.put(`${apiEndpoint}/edit/${id}`, data, { headers: getAuthHeader() }),
	updateSurveyStatus: (id: string, data: any) =>
		http.post(`${apiEndpoint}/status/${id}`, data, { headers: getAuthHeader() }),
	updateSiteSurveyStatus: (data: any) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	changeCurrentStep: (data: any) => http.post(`${apiEndpoint}/change-current-step`, data, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getAllAppointments = () => {
	return ProfileService.getAllAppointments();
};

export const getAppointmentByUserId = (userId: string) => {
	return ProfileService.getAppointmentByUserId(userId);
};

export const getAppointmentDetails = () => {
	return ProfileService.getAppointmentDetails();
};

export const assignTechnician = () => {
	return ProfileService.assignTechnician();
};

export const getAvailableSlotsOfTechnician = (technicianId: string, date: string) => {
	return ProfileService.getAvailableSlotsOfTechnician(technicianId, date);
};

export const bookSiteSurvey = (date: string, time: string) => {
	const data = { date, time };
	return ProfileService.bookSiteSurvey(data);
};

export const updateSiteSurveyStatus = (formData: FormData) => {
	return ProfileService.updateSiteSurveyStatus(formData);
};

export const updateSurveyStatus = (id: string, status: string) => {
	const data = { status };
	return ProfileService.updateSurveyStatus(id, data);
};

export const changeCurrentStep = (data: any) => {
	return ProfileService.changeCurrentStep(data);
};
