import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAllCategories } from "../../Services/categoriesService";

export interface CategoryInterface {
  _id: string;
  name: string;
  color: string;
}

export interface CategoriesSlice {
  loading: boolean;
  categories: CategoryInterface[];
}

const initialState: CategoriesSlice = {
  loading: true,
  categories: [],
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data: any = await getAllCategories();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Reducer logic here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, () => {
        // Optionally, handle loading state
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryInterface[]>) => {
          // Action payload is the fetched logo URL
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        console.error(action.payload);
      });
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.loading;

export default categoriesSlice.reducer;
