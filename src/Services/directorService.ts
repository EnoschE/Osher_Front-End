import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/director";

// =====|  Dashboard Service  |=====

const DashboardService = {
	assignPSLToManager: (data: any) =>
		http.post(`${apiEndpoint}/assign-psl-to-manager`, data, { headers: getAuthHeader() }),
	assignRepresentativeToPSL: (data: any) =>
		http.post(`${apiEndpoint}/assign-representative-to-psl`, data, { headers: getAuthHeader() }),
	assignInstallerManagerToPSL: (data: any) =>
		http.post(`${apiEndpoint}/assign-installer-manager-to-psl`, data, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const assignPSLToManager = (data: any) => {
	return DashboardService.assignPSLToManager(data);
};

export const assignRepresentativeToPSL = (data: any) => {
	return DashboardService.assignRepresentativeToPSL(data);
};

export const assignInstallerManagerToPSL = (data: any) => {
	return DashboardService.assignInstallerManagerToPSL(data);
};
