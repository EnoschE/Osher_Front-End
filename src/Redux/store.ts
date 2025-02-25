import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import surveySlice from "./Slices/surveySlice";
// import { fetchColors, fetchLogo } from "./Slices/generalSlice";
import generalSlice from "./Slices/generalSlice";
import categoriesSlice, { fetchCategories } from "./Slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    categories: categoriesSlice,
    survey: surveySlice,
    general: generalSlice, // TODO: REMOVE THIS AS WELL
  },
});
store.dispatch(fetchCategories());
// store.dispatch(fetchColors());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
