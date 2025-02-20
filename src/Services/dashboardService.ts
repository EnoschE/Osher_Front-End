import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/admin";

// =====|  Dashboard Service  |=====

const DashboardService = {
	getDashboardData: () => http.get(`${apiEndpoint}/all-users`, { headers: getAuthHeader() }),
	changeTechnician: (customerId: string, data: any) =>
		http.put(`${apiEndpoint}/update-assigned-technician/${customerId}`, data, { headers: getAuthHeader() }),
	changeInstaller: (customerId: string, data: any) =>
		http.put(`${apiEndpoint}/update-assigned-installer/${customerId}`, data, { headers: getAuthHeader() }),

	// customers apis
	getCustomersWithCurrentSteps: () => http.get(`${apiEndpoint}/customers-current-steps`, { headers: getAuthHeader() }),
	getCustomerDetails: (customerId: string) =>
		http.get(`${apiEndpoint}/customer-current-step/${customerId}`, { headers: getAuthHeader() }),
	getAssignedTechnician: (customerId: string) =>
		http.get(`${apiEndpoint}/assigned-technician/${customerId}`, { headers: getAuthHeader() }),
	getAssignedInstaller: (customerId: string) =>
		http.get(`${apiEndpoint}/assigned-installer/${customerId}`, { headers: getAuthHeader() }),
	updateCustomer: (customerId: string, data: any) =>
		http.put(`${apiEndpoint}/update-customer/${customerId}`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	updateAccountDetails: (userId: string, data: any) =>
		http.put(`${apiEndpoint}/add-password/${userId}`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	deleteCustomer: (customerId: string) =>
		http.delete(`${apiEndpoint}/delete-user/${customerId}`, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	addNewCustomer: (data: any) =>
		http.post(`${apiEndpoint}/add-customer`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),

	// admins apis
	getAllAdmins: () => http.get(`${apiEndpoint}/admins`, { headers: getAuthHeader() }),
	getAllPSLs: () => http.get(`${apiEndpoint}/get-all-psl`, { headers: getAuthHeader() }),
	getAllPSLsForAdminManager: () =>
		http.get(`${apiEndpoint}/get-all-psl-for-admin-manager`, { headers: getAuthHeader() }),
	getPSLsOfAdminManager: (adminManagerId: string) =>
		http.get(`${apiEndpoint}/get-psls-of-admin-manager/${adminManagerId}`, { headers: getAuthHeader() }),
	getRepresentativesOfPSL: (pslId: string) =>
		http.get(`${apiEndpoint}/get-representatives-of-psl/${pslId}`, { headers: getAuthHeader() }),
	getInstallerManagersOfPSL: (pslId: string) =>
		http.get(`${apiEndpoint}/get-installer-managers-of-psl/${pslId}`, { headers: getAuthHeader() }),
	getAllAdminManagers: () => http.get(`${apiEndpoint}/get-all-admin-managers`, { headers: getAuthHeader() }),
	getAllDirectors: () => http.get(`${apiEndpoint}/get-all-all-directors`, { headers: getAuthHeader() }),
	addNewAdmin: (data: any) =>
		http.post(`${apiEndpoint}/add-admin`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),

	// installers apis
	getAllInstallers: () => http.get(`${apiEndpoint}/installers`, { headers: getAuthHeader() }),
	addNewInstaller: (data: any) =>
		http.post(`${apiEndpoint}/add-installer`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	getInstallerCustomers: (installerId: string) =>
		http.get(`${apiEndpoint}/installer-customers/${installerId}`, { headers: getAuthHeader() }),

	// installer companies
	getAllInstallerCompanies: () => http.get(`${apiEndpoint}/all-installer-companies`, { headers: getAuthHeader() }),
	createInstallerCompany: (data: any) =>
		http.post(`${apiEndpoint}/create-installer-company`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	getInstallerCompanyDetails: (companyId: string) =>
		http.get(`${apiEndpoint}/get-installer-company-details/${companyId}`, { headers: getAuthHeader() }),
	updateInstallerCompany: (companyId: string, data: any) =>
		http.put(`${apiEndpoint}/update-installer-company/${companyId}`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	checkInstallerCompanyPostalCodeAvailability: (postalCode: string) =>
		http.get(`${apiEndpoint}/check-postal-code-availability/${postalCode}`, { headers: getAuthHeader() }),

	// installer admins
	getAllInstallerAdmins: () => http.get(`${apiEndpoint}/all-installer-admins`, { headers: getAuthHeader() }),
	getAllInstallerAdminsByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-installer-admins-of-company/${companyId}`, { headers: getAuthHeader() }),
	// Office managers
	getAllOfficeManagers: () => http.get(`${apiEndpoint}/all-office-managers`, { headers: getAuthHeader() }),
	getAllOfficeManagersByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-office-managers-of-company/${companyId}`, { headers: getAuthHeader() }),
	getManagersOfOfficeManager: (officeManagerId: string) =>
		http.get(`${apiEndpoint}/managers-of-office-manager/${officeManagerId}`, { headers: getAuthHeader() }),
	// Managers
	getAllManagers: () => http.get(`${apiEndpoint}/all-managers`, { headers: getAuthHeader() }),
	getAllManagersForPSL: () => http.get(`${apiEndpoint}/all-managers-for-psl`, { headers: getAuthHeader() }),
	getAllManagersByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-managers-of-company/${companyId}`, { headers: getAuthHeader() }),
	getRepresentativesOfManager: (managerId: string) =>
		http.get(`${apiEndpoint}/representatives-of-manager/${managerId}`, { headers: getAuthHeader() }),
	// Representatives
	getAllRepresentatives: () => http.get(`${apiEndpoint}/all-representatives`, { headers: getAuthHeader() }),
	getAllRepresentativesForPSL: () =>
		http.get(`${apiEndpoint}/all-representatives-for-psl`, { headers: getAuthHeader() }),
	getAllRepresentativesByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-representatives-of-company/${companyId}`, { headers: getAuthHeader() }),
	getCustomersOfRepresentative: (representativeId: string) =>
		http.get(`${apiEndpoint}/customers-of-representative/${representativeId}`, { headers: getAuthHeader() }),
	getAllTechniciansByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-technicians-of-company/${companyId}`, { headers: getAuthHeader() }),
	// Customers
	getAllAssignedCustomers: () => http.get(`${apiEndpoint}/all-assigned-customers`, { headers: getAuthHeader() }),
	getAllAssignedCustomersByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-assigned-customers-of-company/${companyId}`, { headers: getAuthHeader() }),
	getAllUnassignedCustomers: () => http.get(`${apiEndpoint}/all-unassigned-customers`, { headers: getAuthHeader() }),
	getAllUnassignedCustomersByCompanyId: (companyId: string) =>
		http.get(`${apiEndpoint}/all-unassigned-customers-of-company/${companyId}`, { headers: getAuthHeader() }),
	getLogsOfCustomer: (customerId: string) =>
		http.get(`${apiEndpoint}/customer-logs/${customerId}`, { headers: getAuthHeader() }),
	addLogComment: (data: any) => http.post(`${apiEndpoint}/add-log-comment`, data, { headers: getAuthHeader() }),

	assignRepresentative: (customerId: string, data: any) =>
		http.put(`${apiEndpoint}/assign-representative/${customerId}`, data, { headers: getAuthHeader() }),
	assignCompany: (data: any) =>
		http.post(`${apiEndpoint}/assign-installer-company`, data, { headers: getAuthHeader() }),
	changeOfficeManager: (managerId: string, data: any) =>
		http.put(`${apiEndpoint}/change-office-manager/${managerId}`, data, { headers: getAuthHeader() }),
	changeManager: (representativeId: string, data: any) =>
		http.put(`${apiEndpoint}/change-manager/${representativeId}`, data, { headers: getAuthHeader() }),

	getDetailsOfInstaller: (installerId: string) =>
		http.get(`${apiEndpoint}/installer-details/${installerId}`, { headers: getAuthHeader() }),
	deleteInstallerById: (role: string, installerId: string) =>
		http.delete(`${apiEndpoint}/delete-installer/${installerId}`, { headers: getAuthHeader() }),
	updateDetailsOfInstaller: (installerId: string, data: any) =>
		http.put(`${apiEndpoint}/update-installer-details/${installerId}`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
	createNewInstaller: (data: any) =>
		http.post(`${apiEndpoint}/create-new-installer`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),

	// technicians apis
	getAllTechnicians: () => http.get(`${apiEndpoint}/all-technicians`, { headers: getAuthHeader() }),
	getTechnicianCustomers: (installerId: string) =>
		http.get(`${apiEndpoint}/customers-of-technician/${installerId}`, { headers: getAuthHeader() }),
	getCustomerInstallerDetails: (userId: string) =>
		http.get(`${apiEndpoint}/user-installer-details/${userId}`, { headers: getAuthHeader() }),
	getCustomerAccessToken: (data: { customerId: string }) =>
		http.post(`${apiEndpoint}/customer-access-token`, data, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getDashboardData = () => {
	return DashboardService.getDashboardData();
};

export const changeTechnician = (customerId: string, data: any) => {
	return DashboardService.changeTechnician(customerId, data);
};

export const changeInstaller = (customerId: string, data: any) => {
	return DashboardService.changeInstaller(customerId, data);
};

export const getCustomersWithCurrentSteps = () => {
	return DashboardService.getCustomersWithCurrentSteps();
};

export const getCustomerDetails = (customerId: string) => {
	return DashboardService.getCustomerDetails(customerId);
};

export const deleteCustomer = (customerId: string) => {
	return DashboardService.deleteCustomer(customerId);
};

export const getAssignedTechnician = (customerId: string) => {
	return DashboardService.getAssignedTechnician(customerId);
};

export const assignCompany = (data: any) => {
	return DashboardService.assignCompany(data);
};

export const getAssignedInstaller = (customerId: string) => {
	return DashboardService.getAssignedInstaller(customerId);
};

export const updateCustomer = (customerId: string, data: any) => {
	return DashboardService.updateCustomer(customerId, data);
};

export const addNewCustomer = (data: any) => {
	return DashboardService.addNewCustomer(data);
};

export const getAllAdmins = () => {
	return DashboardService.getAllAdmins();
};

export const getAllPSLs = () => {
	return DashboardService.getAllPSLs();
};

export const getAllPSLsForAdminManager = () => {
	return DashboardService.getAllPSLsForAdminManager();
};

export const getPSLsOfAdminManager = (id: string) => {
	return DashboardService.getPSLsOfAdminManager(id);
};

export const getRepresentativesOfPSL = (id: string) => {
	return DashboardService.getRepresentativesOfPSL(id);
};

export const getInstallerManagersOfPSL = (id: string) => {
	return DashboardService.getInstallerManagersOfPSL(id);
};

export const getAllAdminManagers = () => {
	return DashboardService.getAllAdminManagers();
};

export const getAllDirectors = () => {
	return DashboardService.getAllDirectors();
};

export const addNewAdmin = (data: any) => {
	return DashboardService.addNewAdmin(data);
};

export const getAllInstallers = () => {
	return DashboardService.getAllInstallers();
};

export const addNewInstaller = (data: any) => {
	return DashboardService.addNewInstaller(data);
};

export const getInstallerCustomers = (installerId: string) => {
	return DashboardService.getInstallerCustomers(installerId);
};

export const getAllTechnicians = () => {
	return DashboardService.getAllTechnicians();
};

export const getTechnicianCustomers = (technicianId: string) => {
	return DashboardService.getTechnicianCustomers(technicianId);
};

export const getAllInstallerCompanies = () => {
	return DashboardService.getAllInstallerCompanies();
};

export const createInstallerCompany = (data: any) => {
	return DashboardService.createInstallerCompany(data);
};

export const getInstallerCompanyDetails = (id: string) => {
	return DashboardService.getInstallerCompanyDetails(id);
};


export const checkInstallerCompanyPostalCodeAvailability = (postalCode: string) => {
	return DashboardService.checkInstallerCompanyPostalCodeAvailability(postalCode);
};

export const getDetailsOfInstaller = (id: string) => {
	return DashboardService.getDetailsOfInstaller(id);
};

export const updateDetailsOfInstaller = (installerId: string, data: any) => {
	return DashboardService.updateDetailsOfInstaller(installerId, data);
};

export const createNewInstaller = (data: any) => {
	return DashboardService.createNewInstaller(data);
};

export const deleteInstallerById = (id: string, role?: string) => {
	return DashboardService.deleteInstallerById(role ?? "", id);
};

export const updateInstallerCompany = (id: string, data: any) => {
	return DashboardService.updateInstallerCompany(id, data);
};

export const getAllInstallerAdmins = () => {
	return DashboardService.getAllInstallerAdmins();
};

export const getAllInstallerAdminsByCompanyId = (companyId: string) => {
	return DashboardService.getAllInstallerAdminsByCompanyId(companyId);
};

export const getAllOfficeManagers = () => {
	return DashboardService.getAllOfficeManagers();
};

export const getAllOfficeManagersByCompanyId = (companyId: string) => {
	return DashboardService.getAllOfficeManagersByCompanyId(companyId);
};

export const getManagersOfOfficeManager = (id: string) => {
	return DashboardService.getManagersOfOfficeManager(id);
};

export const getAllManagers = () => {
	return DashboardService.getAllManagers();
};

export const getAllManagersForPSL = () => {
	return DashboardService.getAllManagersForPSL();
};

export const getAllManagersByCompanyId = (companyId: string) => {
	return DashboardService.getAllManagersByCompanyId(companyId);
};

export const getRepresentativesOfManager = (id: string) => {
	return DashboardService.getRepresentativesOfManager(id);
};

export const getAllRepresentatives = () => {
	return DashboardService.getAllRepresentatives();
};

export const getAllRepresentativesForPSL = () => {
	return DashboardService.getAllRepresentativesForPSL();
};

export const getAllRepresentativesByCompanyId = (companyId: string) => {
	return DashboardService.getAllRepresentativesByCompanyId(companyId);
};

export const getAllTechniciansByCompanyId = (companyId: string) => {
	return DashboardService.getAllTechniciansByCompanyId(companyId);
};

export const getCustomersOfRepresentative = (id: string) => {
	return DashboardService.getCustomersOfRepresentative(id);
};

export const getAllUnassignedCustomers = () => {
	return DashboardService.getAllUnassignedCustomers();
};

export const getLogsOfCustomer = (id: string) => {
	return DashboardService.getLogsOfCustomer(id);
};

export const addLogComment = (data: any) => {
	return DashboardService.addLogComment(data);
};

export const getAllUnassignedCustomersByCompanyId = (id: string) => {
	return DashboardService.getAllUnassignedCustomersByCompanyId(id);
};

export const getAllAssignedCustomers = () => {
	return DashboardService.getAllAssignedCustomers();
};

export const getAllAssignedCustomersByCompanyId = (id: string) => {
	return DashboardService.getAllAssignedCustomersByCompanyId(id);
};

export const assignRepresentative = (customerId: string, data: any) => {
	return DashboardService.assignRepresentative(customerId, data);
};

export const changeOfficeManager = (mangerId: string, data: any) => {
	return DashboardService.changeOfficeManager(mangerId, data);
};

export const changeManager = (representativeId: string, data: any) => {
	return DashboardService.changeManager(representativeId, data);
};

export const getCustomerInstallerDetails = (userId: string) => {
	return DashboardService.getCustomerInstallerDetails(userId);
};

export const getCustomerAccessToken = (data: { customerId: string }) => {
	return DashboardService.getCustomerAccessToken(data);
};

export const updateAccountDetails = (userId: string, data: any) => {
	return DashboardService.updateAccountDetails(userId, data);
};
