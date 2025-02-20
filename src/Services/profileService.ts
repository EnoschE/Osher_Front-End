import axios from "axios";
import http from "./httpService";
import { AppDispatch } from "../Redux/store";
import { resetUserState, saveUserState } from "../Redux/Slices/userSlice";
import { getAuthHeader, setJwtToken } from "./userService";

const apiEndpoint = "/profile";

// =====|  Profile Service  |=====

const ProfileService = {
  getProfile: () => http.get(`${apiEndpoint}/me`, { headers: getAuthHeader() }),
  updateProfile: (data: any) =>
    http.put(`${apiEndpoint}/edit-profile`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  verifyEmailOtp: (data: any) =>
    http.post(`${apiEndpoint}/verifyOTP`, data, { headers: getAuthHeader() }),
};

// =====|  APIs  |=====

export const getProfile =
  () =>
  async (dispatch: AppDispatch): Promise<any | void> => {
    try {
      const data: any = await ProfileService.getProfile();
      console.log("Profile: ", data);

      const userData = getUserObjectForRedux(data);
      dispatch(resetUserState());
      dispatch(saveUserState(userData));

      return userData;
    } catch (error) {
      console.error("getProfile (API): ", error);
      throw error;
    }
  };

export const updateProfile =
  (formData: any) =>
  async (dispatch: AppDispatch): Promise<any | void> => {
    try {
      const data: any = await ProfileService.updateProfile(formData);
      console.log("Updated Profile: ", data);

      const userData = getUserObjectForRedux(data?.user);
      dispatch(saveUserState(userData));
      if (data?.token) setJwtToken(data?.token);

      return userData;
    } catch (error) {
      console.error("updateProfile (API): ", error);
      throw error;
    }
  };

export const verifyEmailOtp = (data: any) => {
  return ProfileService.verifyEmailOtp(data);
};

// TODO in future: move this google api and all other google apis in a separate googleApiService file
export const getGoogleProfile = async (accessToken: string) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return data;
};

const getUserObjectForRedux = (user: any) => ({
  id: user?._id,
  address: user?.address,
  name: user?.name,
  email: user?.email,
  role: user?.role,
  password: user?.password,
  picture: user?.picture || "",
  phone: user?.phone,
  isAdmin: user?.isAdmin,
});
