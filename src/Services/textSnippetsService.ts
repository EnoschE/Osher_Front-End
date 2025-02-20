
import { TextSnippet } from "../Utils/types";
import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "text-snippets";

// =====|  Profile Service  |=====

const TextSnippetsService = {
	getAllTextSnippets : (selectedDashboard:string) => http.get(`${apiEndpoint}/${selectedDashboard}`,{ headers: getAuthHeader() }),

	updateTextSnippets : (data  : TextSnippet[] , selectedDashboard: string) => http.put(`${apiEndpoint}/${selectedDashboard}`,data ,{ headers: getAuthHeader() }),
	updateSingleTextSnippet : (data  : TextSnippet , selectedDashboard : string) => http.put(`${apiEndpoint}/update-one/${selectedDashboard}`,data ,{ headers: getAuthHeader() }),

	
};


export const updateTextSnippets = (data  : TextSnippet[] , selectedDashboard : string) => {
	return TextSnippetsService.updateTextSnippets(data , selectedDashboard);
};


export const getAllTextSnippets = (selectedDashboard : string) => {
	return TextSnippetsService.getAllTextSnippets(selectedDashboard);
};


export const updateSingleTextSnippet = (data  : TextSnippet , selectedDashboard: string) => {
	return TextSnippetsService.updateSingleTextSnippet(data, selectedDashboard);
};