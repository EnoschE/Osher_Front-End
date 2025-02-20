import http from "./httpService";

interface PasswordProps {
	newpassword: string;
	confirmpassword: string;
}

// =====|  Password Service  |=====

const PasswordService = {
	sendResetPasswordLink: (addressData: { email: string }) => http.post(`/password-reset`, addressData),
	resetPassword: (userId: string, token: string, data: PasswordProps) =>
		http.post(`/reset-password/${userId}/${token}`, data),
};

// =====|  APIs  |=====

export const sendResetPasswordLink = async (email: string): Promise<any | void> => {
	const data = { email };
	return PasswordService.sendResetPasswordLink(data);
};

export const resetPassword = async (userId: string, token: string, data: PasswordProps): Promise<any | void> => {
	return PasswordService.resetPassword(userId, token, data);
};
