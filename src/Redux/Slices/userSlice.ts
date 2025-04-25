import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BillDataState {
  file?: string;
  delivery?: string | number;
  supply?: string | number;
  provider?: string;
}
export interface UserState {
  _id?: string;
  name: string;
  email?: string;
  password?: string;
  address?: string;
  bill?: number | string;
  role?: string;
  phone?: string;
  picture?: string;
  billData?: BillDataState | null;
  isAdmin?: boolean;
}

const initialState: UserState = {
  _id: "",
  name: "",
  email: "",
  password: "",
  address: "",
  bill: undefined,
  role: "",
  phone: "",
  picture: "",
  billData: null,
  isAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    saveUserState: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.address = action.payload.address;
      state.bill = action.payload.bill;
      state.role = action.payload.role;
      state.phone = action.payload.phone;
      state.picture = action.payload.picture;
      state.isAdmin = action.payload.isAdmin;
      state.billData = action.payload.billData;
    },
    saveBill: (state, action: PayloadAction<number | string>) => {
      state.bill = action.payload;
    },
    saveAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    saveEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    saveBillDetails: (state, action: PayloadAction<BillDataState>) => {
      state.billData = action.payload;
    },
    saveAddressObject: (state, action: PayloadAction<any | null>) => {
      state.address = action.payload?.description || "";
    },
    resetUserState: (state) => {
      state._id = initialState._id;
      state.name = initialState.name;
      state.email = initialState.email;
      state.password = initialState.password;
      state.address = initialState.address;
      state.bill = initialState.bill;
      state.role = initialState.role;
      state.phone = initialState.phone;
      state.picture = initialState.picture;
      state.billData = initialState.billData;
      state.isAdmin = initialState.isAdmin;
    },
  },
});

export const {
  saveUserState,
  saveBillDetails,
  saveEmail,
  saveAddress,
  saveAddressObject,
  saveBill,
  resetUserState,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectBill = (state: RootState) => state.user.bill;
export const selectBillData = (state: RootState) => state.user.bill;
export const selectAddress = (state: RootState) => state.user.address;

export default userSlice.reducer;
