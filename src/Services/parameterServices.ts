import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/parameters";

// =====|  Dashboard Service  |=====

const DashboardService = {
	createParametersInDB: () => http.post(`${apiEndpoint}/create-new-parameters`, null, { headers: getAuthHeader() }),
	getParameters: () => http.get(`${apiEndpoint}/`, { headers: getAuthHeader() }),
	updateParameters: (data: any) => {
      
        return http.put(`${apiEndpoint}/update-parameters`, data, { headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() }});
    },
};

// =====|  APIs  |=====

export const getParameters = () => {
	return DashboardService.getParameters();
};

export const createParametersInDB = () => {
	return DashboardService.createParametersInDB();
};

export const updateParameters = (data: any) => {
	return DashboardService.updateParameters(data);
};
