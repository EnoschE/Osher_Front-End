import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import http from "../../Services/httpService";
import { getColors } from "../../Services/colorsServices";

export interface ColorsInterface {
	primary: string;
	primaryLight: string;
	primaryMidLight: string;
	primaryExtraLight: string;
	primaryLightNew: string;
	text: string;
	textMid: string;
	border: string;
	lightGray: string;
	gray: string;
	link: string;
	success: string;
	error: string;
	successLight: string;
	errorLight: string;
	successBg: string;
	errorBg: string;
	darkBg: string;
}

export interface GeneralState {
	logo: string;
	colors: ColorsInterface;
}

const initialState: GeneralState = {
	logo: "",
	colors: {
		primary: "#FFA800",
		primaryLight: "#FFA80080",
		primaryMidLight: "#FFDB96",
		primaryExtraLight: "#FFF6E6",
		primaryLightNew: "#FFF6E6",
		text: "#1C1D34",
		textMid: "#475467",
		border: "#E6E6E6",
		lightGray: "#F6F5F8",
		gray: "#7A7A7A",
		link: "#3581DB",
		success: "#377E36",
		error: "#B12F30",
		successLight: "#19B616",
		errorLight: "#EC3F36",
		successBg: "#E0F0E4",
		errorBg: "#FEECEB",
		darkBg: "#2A223C",
	},
};

export const fetchLogo = createAsyncThunk("general/fetchLogo", async (_, { rejectWithValue }) => {
	try {
		const response = await http.get("/parameters/get-logo");
		return response.data;
	} catch (error) {
		return rejectWithValue("Failed to fetch logo");
	}
});

export const fetchColors = createAsyncThunk("general/fetchColors", async (_, { rejectWithValue }) => {
	try {
		const { data } = await getColors();
		let updatedColors = { ...initialState.colors };
		updatedColors = { ...updatedColors, ...data };

		updatedColors.textMid = data?.textSecondary || updatedColors.textMid;

		document.documentElement.style.setProperty("--selection-color", updatedColors.primary + "30");

		return {
			primary: updatedColors?.primary,
			primaryLight: updatedColors.primary + "80",
			primaryMidLight: updatedColors.primary + "20",
			primaryExtraLight: updatedColors.primary + "10",
			primaryLightNew: updatedColors.primary + "10",
			text: updatedColors.text,
			textMid: updatedColors.textMid,
			border: updatedColors.border,
			gray: updatedColors.gray,
			lightGray: updatedColors.lightGray,
			link: updatedColors.link,
			success: updatedColors.success,
			error: updatedColors.error,
			successLight: updatedColors.successLight,
			errorLight: updatedColors.errorLight,
			successBg: updatedColors.successBg,
			errorBg: updatedColors.errorBg,
			darkBg: updatedColors.darkBg,
		};
	} catch (error) {
		return rejectWithValue("Failed to fetch Colors");
	}
});

export const generalSlice = createSlice({
	name: "generalSlice",
	initialState,
	reducers: {
		// Reducer logic here
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLogo.pending, (state) => {
				// Optionally, handle loading state
			})
			.addCase(fetchLogo.fulfilled, (state, action) => {
				// Action payload is the fetched logo URL
				state.logo = action.payload;
			})
			.addCase(fetchLogo.rejected, (state, action) => {
				console.error(action.payload);
			})
			.addCase(fetchColors.pending, (state) => {
				// Optionally, handle loading state
			})
			.addCase(fetchColors.fulfilled, (state, action: PayloadAction<ColorsInterface>) => {
				// Action payload is the fetched colors object
				state.colors = action.payload || initialState.colors;
			})
			.addCase(fetchColors.rejected, (state, action) => {
				console.error(action.payload);
			});
	},
});

export const selectLogoUrl = (state: RootState) => state.general.logo;
export const selectColors = (state: RootState) => state.general.colors;

export default generalSlice.reducer;
