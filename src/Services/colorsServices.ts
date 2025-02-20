import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/colors";

// =====|  Dashboard Service  |=====

const ColorsService = {
	getColors: () => http.get(`${apiEndpoint}/`),
	updateColors: (data: any) => http.put(`${apiEndpoint}/update-color`, data, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getColors = () => {
	return ColorsService.getColors();
};

export const updateColors = (data: any) => {
	return ColorsService.updateColors(data);
};
