import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/cad-design";

// =====|  CAD Design Service  |=====

const CADDesignService = {
	getCADDesignByUserId: (userId: string) => http.get(`${apiEndpoint}/by-user/${userId}`, { headers: getAuthHeader() }),
	updateCADDesignStatus: (data: FormData) =>
		http.put(`${apiEndpoint}/update-status`, data, {
			headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
		}),
};

// =====|  APIs  |=====

export const getCADDesignByUserId = (userId: string) => {
	return CADDesignService.getCADDesignByUserId(userId);
};

export const updateCADDesignStatus = (formData: FormData) => {
	return CADDesignService.updateCADDesignStatus(formData);
};
