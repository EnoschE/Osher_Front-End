import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getDashboardAllData } from "../../Services/profileService";
import { isUserLoggedIn } from "../../Services/userService";

interface DashboardState {
  ads: number;
  posts: number;
  brands: number;
  influencers: number;
  loading: boolean;
}

const initialState: DashboardState = {
  ads: 0,
  posts: 0,
  brands: 0,
  influencers: 0,
  loading: true,
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      if (isUserLoggedIn()) {
        const data: any = await getDashboardAllData();
        return data;
      } else return initialState;
    } catch (error) {
      return rejectWithValue("Failed to fetch dashboard data");
    }
  },
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Reducer logic here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, () => {
        // state.loading = true;
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<DashboardState>) => {
          state.ads = action.payload?.ads || 0;
          state.posts = action.payload?.posts || 0;
          state.brands = action.payload?.brands || 0;
          state.influencers = action.payload?.influencers || 0;
          state.loading = false;
        },
      )
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        console.error(action.payload);
      });
  },
});

export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.loading;
export const selectDashboardData = (state: RootState) => state.dashboard;

export default dashboardSlice.reducer;
