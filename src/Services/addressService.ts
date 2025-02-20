import http from "./httpService";

// =====|  Address Service  |=====

const AddressService = {
	verifyAddress: (addressData: { address: string }) => http.post(`/verify-address`, addressData),
};

// =====|  APIs  |=====

export const verifyAddress = async (address: string): Promise<any | void> => {
	const data = { address };
	return AddressService.verifyAddress(data);
};
