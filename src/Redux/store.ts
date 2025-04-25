import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import dashboardSlice from "./Slices/dashboardSlice";
import categoriesSlice, { fetchCategories } from "./Slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    dashboard: dashboardSlice,
    categories: categoriesSlice,
  },
});

store.dispatch(fetchCategories());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
