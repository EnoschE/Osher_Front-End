import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAllCategories } from "../../Services/categoriesService";

export interface CategoryInterface {
  _id: string;
  name: string;
  color: string;
}

export interface CategoriesSlice {
  categories: CategoryInterface[];
}

const initialState: CategoriesSlice = {
  categories: [],
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllCategories();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState,
  reducers: {
    // Reducer logic here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        // Optionally, handle loading state
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // Action payload is the fetched logo URL
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export default categoriesSlice.reducer;
