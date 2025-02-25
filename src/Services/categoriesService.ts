import axios from "axios";
import http from "./httpService";
import { AppDispatch } from "../Redux/store";
import { resetUserState, saveUserState } from "../Redux/Slices/userSlice";
import { getAuthHeader, setJwtToken } from "./userService";

const apiEndpoint = "/categories";

// =====|  Categories Service  |=====

const CategoriesService = {
  getAllCategories: () => http.get(`${apiEndpoint}`),
  // getAllCategories: () => http.get(`${apiEndpoint}/me`, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

// export const getAllCategories =
//   () =>
//   async (dispatch: AppDispatch): Promise<any | void> => {
//     try {
//       const data: any = await CategoriesService.getAllCategories();
//       console.log("Categories: ", data);

//       // const userData = getUserObjectForRedux(data);
//       // dispatch(resetUserState());
//       // dispatch(saveUserState(userData));

//       // return userData;
//     } catch (error) {
//       console.error("getProfile (API): ", error);
//       throw error;
//     }
//   };

export const getAllCategories = async () => {
  try {
    const data: any = await CategoriesService.getAllCategories();
    return data;
  } catch (error) {
    console.error("getAllCategories (API): ", error);
    throw error;
  }
};
