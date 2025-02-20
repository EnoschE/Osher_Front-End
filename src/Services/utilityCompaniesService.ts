import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/utlity-company";

const UtilityCompany = {
	getAllUtilityCompanies: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
	getSingleUtilityCompany: (id: string) => http.get(`${apiEndpoint}/${id}`, { headers: getAuthHeader() }),
	updateUtilityCompany: (data: any, id: string) =>
		http.put(`${apiEndpoint}/update-utility/${id}`, data, { headers: getAuthHeader() }),
	deleteUtilityCompany: (id: string) => http.delete(`${apiEndpoint}/${id}`, { headers: getAuthHeader() }),

	addNewUtilityCompany: (data: any) =>
		http.post(`${apiEndpoint}/create-new-utility-company`, data, {
			headers: { "Content-Type": "application/json", ...getAuthHeader() },
		}),
	checkPostalCodeAvailability: (postalCode: string) =>
		http.get(`${apiEndpoint}/check-postal-code-availability/${postalCode}`, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getAllUtilityCompanies = () => {
	return UtilityCompany.getAllUtilityCompanies();
};

export const addNewUtilityCompany = (data: any) => {
	return UtilityCompany.addNewUtilityCompany(data);
};

export const updateUtilityCompany = (data: any, id: string) => {
	return UtilityCompany.updateUtilityCompany(data, id);
};

export const deleteUtilityCompany = (id: string) => {
	return UtilityCompany.deleteUtilityCompany(id);
};

export const getSingleUtilityCompany = (id: string) => {
	return UtilityCompany.getSingleUtilityCompany(id);
};

export const checkPostalCodeAvailability = (postalCode: string) => {
	return UtilityCompany.checkPostalCodeAvailability(postalCode);
};
