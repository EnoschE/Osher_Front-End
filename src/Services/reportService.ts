import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/reports";

// =====|  Reports Service  |=====

const ReportsService = {
	getSolarReport: (reportData: any) => http.post(`${apiEndpoint}/onboarding-reports`, reportData),
	getSolarSpecs: (reportData: any) =>
		http.post(`${apiEndpoint}/dashboard-reports`, reportData, { headers: getAuthHeader() }),
	getFinancialImpactSavings: (data: any) =>
		http.post(`${apiEndpoint}/financialimpact-savings`, data, { headers: getAuthHeader() }),
	getFinancialImpactPayment: (data: any) =>
		http.post(`${apiEndpoint}/financialimpact-payment`, data, { headers: getAuthHeader() }),
	getBillAnalysis: (data: any) => http.post(`${apiEndpoint}/bill-analysis`, data, { headers: getAuthHeader() }),
	getPaymentOption: (data: any) => http.post(`${apiEndpoint}/payment-option`, data, { headers: getAuthHeader() }),
	uploadElectricBill: (data: any) =>
		http.post(`${apiEndpoint}/store-bill`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getSolarReport = async (monthlyBill: string | number): Promise<any | void> => {
	const data = { monthlyBill };
	return ReportsService.getSolarReport(data);
};

export const getSolarSpecs = async (monthlyBill: string | number): Promise<any | void> => {
	const data = { monthlyBill };
	return ReportsService.getSolarSpecs(data);
};

export const getFinancialImpactSavings = async (monthlyBill: string | number): Promise<any | void> => {
	const data = { monthlyBill };
	return ReportsService.getFinancialImpactSavings(data);
};

export const getFinancialImpactPayment = async (monthlyBill: string | number): Promise<any | void> => {
	const data = { monthlyBill };
	return ReportsService.getFinancialImpactPayment(data);
};

export const getBillAnalysis = async (
	monthlyBill: string | number,
	delivery_service: string | number,
	supply_charges: string | number,
): Promise<any | void> => {
	const data = { delivery_service, supply_charges, monthlyBill };
	return ReportsService.getBillAnalysis(data);
};

export const getPaymentOption = async (monthlyBill: string | number, Pv: string | number): Promise<any | void> => {
	const data = { Pv, monthlyBill };
	return ReportsService.getPaymentOption(data);
};

export const uploadElectricBill = async (formData: any): Promise<any | void> => {
	return ReportsService.uploadElectricBill(formData);
};
