import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface SurveyState {
	id?: number | string;
	name: string;
	status?: string;
}

const initialState: SurveyState = {
	id: "",
	name: "",
	status: "",
};

export const surveySlice = createSlice({
	name: "survey",
	initialState: initialState,
	reducers: {
		saveSurveyState: (state, action: PayloadAction<SurveyState>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.status = action.payload.status;
		},
		saveStatus: (state, action: PayloadAction<string>) => {
			state.status = action.payload;
		},
		resetSurveyState: (state) => {
			state.id = initialState.id;
			state.name = initialState.name;
			state.status = initialState.status;
		},
	},
});

export const { saveSurveyState, saveStatus, resetSurveyState } = surveySlice.actions;

export const selectSurvey = (state: RootState) => state.survey;
export const selectSurveyStatus = (state: RootState) => state.survey.status;

export default surveySlice.reducer;
