import { FunnelFiltersState } from "../Components/Dashboard/FiltersPopover";
import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/installer-company";

// =====|  Profile Service  |=====

const ProfileService = {
	getAllOfficeManagers: () => http.get(`${apiEndpoint}/all-office-managers`, { headers: getAuthHeader() }),
	getAllManagers: () => http.get(`${apiEndpoint}/all-managers`, { headers: getAuthHeader() }),
	getAllInstallerAdmins: () => http.get(`${apiEndpoint}/all-installer-admins`, { headers: getAuthHeader() }),
	getAllUnassignedCustomers: () => http.get(`${apiEndpoint}/all-unassigned-customers`, { headers: getAuthHeader() }),
	getAllAssignedCustomers: () => http.get(`${apiEndpoint}/all-assigned-customers`, { headers: getAuthHeader() }),
	getAllRepresentatives: () => http.get(`${apiEndpoint}/all-representatives`, { headers: getAuthHeader() }),
	createNewInstaller: (data: any) =>
		http.post(`${apiEndpoint}/create-new-installer`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	getDetailsOfInstaller: (installerId: string) =>
		http.get(`${apiEndpoint}/installer-details/${installerId}`, { headers: getAuthHeader() }),
	getCurrentStepOfCustomer: (customerId: string) =>
		http.get(`${apiEndpoint}/customer-current-step/${customerId}`, { headers: getAuthHeader() }),
	getLogsOfCustomer: (customerId: string) =>
		http.get(`${apiEndpoint}/customer-logs/${customerId}`, { headers: getAuthHeader() }),
	addLogComment: (data: any) => http.post(`${apiEndpoint}/add-log-comment`, data, { headers: getAuthHeader() }),
	updateDetailsOfInstaller: (installerId: string, data: any) =>
		http.put(`${apiEndpoint}/update-installer-details/${installerId}`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	deleteInstallerById: (installerId: string) =>
		http.delete(`${apiEndpoint}/delete-installer/${installerId}`, { headers: getAuthHeader() }),
	getManagersOfOfficeManager: (officeManagerId: string) =>
		http.get(`${apiEndpoint}/managers-of-office-manager/${officeManagerId}`, { headers: getAuthHeader() }),
	getRepresentativesOfManager: (managerId: string) =>
		http.get(`${apiEndpoint}/representatives-of-manager/${managerId}`, { headers: getAuthHeader() }),
	getCustomersOfRepresentative: (representativeId: string) =>
		http.get(`${apiEndpoint}/customers-of-representative/${representativeId}`, { headers: getAuthHeader() }),
	assignRepresentative: (customerId: string, data: any) =>
		http.put(`${apiEndpoint}/assign-representative/${customerId}`, data, { headers: getAuthHeader() }),
	changeOfficeManager: (managerId: string, data: any) =>
		http.put(`${apiEndpoint}/change-office-manager/${managerId}`, data, { headers: getAuthHeader() }),
	changeManager: (representativeId: string, data: any) =>
		http.put(`${apiEndpoint}/change-manager/${representativeId}`, data, { headers: getAuthHeader() }),

	getReferralLink: () => http.post(`${apiEndpoint}/representative/referral-link`, {}, { headers: getAuthHeader() }),
	getFunnelData: (query: string) =>
		// http.get(`${apiEndpoint}/get-funnel-data${userId ? `?userId=${userId}` : ""}`, { headers: getAuthHeader() }),
		http.get(`${apiEndpoint}/get-funnel-data${query}`, { headers: getAuthHeader() }),
	getLeaderBoard: (role: string) => http.get(`${apiEndpoint}/get-leaderboard/${role}`, { headers: getAuthHeader() }),
	// getFunnelDataForStep: (step: string, userId: string) =>
	// 	http.get(`${apiEndpoint}/get-funnel-data-for-step/${step}${userId ? `?userId=${userId}` : ""}`, {
	getFunnelDataForStep: (step: string, query: string) =>
		http.get(`${apiEndpoint}/get-funnel-data-for-step/${step}${query}`, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getAllOfficeManagers = () => {
	return ProfileService.getAllOfficeManagers();
};

export const getAllManagers = () => {
	return ProfileService.getAllManagers();
};

export const getAllInstallerAdmins = () => {
	return ProfileService.getAllInstallerAdmins();
};

export const getAllUnassignedCustomers = () => {
	return ProfileService.getAllUnassignedCustomers();
};

export const getAllAssignedCustomers = () => {
	return ProfileService.getAllAssignedCustomers();
};

export const getAllRepresentatives = () => {
	return ProfileService.getAllRepresentatives();
};

export const createNewInstaller = (data: any) => {
	return ProfileService.createNewInstaller(data);
};

export const getDetailsOfInstaller = (installerId: string) => {
	return ProfileService.getDetailsOfInstaller(installerId);
};

export const getManagersOfOfficeManager = (officeManagerId: string) => {
	return ProfileService.getManagersOfOfficeManager(officeManagerId);
};

export const getRepresentativesOfManager = (managerId: string) => {
	return ProfileService.getRepresentativesOfManager(managerId);
};

export const getCustomersOfRepresentative = (managerId: string) => {
	return ProfileService.getCustomersOfRepresentative(managerId);
};

export const getCurrentStepOfCustomer = (managerId: string) => {
	return ProfileService.getCurrentStepOfCustomer(managerId);
};

export const getLogsOfCustomer = (customerId: string) => {
	return ProfileService.getLogsOfCustomer(customerId);
};

export const addLogComment = (data: any) => {
	return ProfileService.addLogComment(data);
};

export const updateDetailsOfInstaller = (installerId: string, data: any) => {
	return ProfileService.updateDetailsOfInstaller(installerId, data);
};

export const assignRepresentative = (customerId: string, data: any) => {
	return ProfileService.assignRepresentative(customerId, data);
};

export const changeOfficeManager = (mangerId: string, data: any) => {
	return ProfileService.changeOfficeManager(mangerId, data);
};

export const changeManager = (representativeId: string, data: any) => {
	return ProfileService.changeManager(representativeId, data);
};

export const deleteInstallerById = (installerId: string) => {
	return ProfileService.deleteInstallerById(installerId);
};

export const getReferralLink = () => {
	return ProfileService.getReferralLink();
};

export const getFunnelData = (id?: string, filters?: FunnelFiltersState) => {
	const query = getQueryParamsForFunnelAPIs(id, filters);
	return ProfileService.getFunnelData(query);
};

export const getFunnelDataForStep = (step: string, userId?: string, filters?: FunnelFiltersState) => {
	const query = getQueryParamsForFunnelAPIs(userId, filters);
	return ProfileService.getFunnelDataForStep(step, query);
};

export const getLeaderBoard = (role: string) => {
	return ProfileService.getLeaderBoard(role);
};

const getQueryParamsForFunnelAPIs = (userId?: string, filters?: FunnelFiltersState) => {
	let query = userId ? `?userId=${userId}` : "";
	if (filters?.timeFilter) {
		query = query + `${query ? "&" : "?"}filterBy=${filters.timeFilter}`;
	}
	if (filters?.unit) {
		query = query + `${query ? "&" : "?"}unit=${filters.unit}`;
	}
	if (filters?.minDate && filters?.maxDate) {
		query = query + `${query ? "&" : "?"}minDate=${filters.minDate}&maxDate=${filters.maxDate}`;
	}
	return query;
};
