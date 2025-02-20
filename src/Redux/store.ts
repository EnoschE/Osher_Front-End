import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import surveySlice from "./Slices/surveySlice";
import { fetchColors, fetchLogo } from "./Slices/generalSlice";
import generalSlice from "./Slices/generalSlice";

export const store = configureStore({
	reducer: {
		user: userSlice,
		survey: surveySlice,
		general: generalSlice
	},
});
store.dispatch(fetchLogo());
store.dispatch(fetchColors());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
