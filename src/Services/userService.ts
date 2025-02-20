import jwtDecode from "jwt-decode";
import { UserState, saveUserState } from "../Redux/Slices/userSlice";
import { AppDispatch } from "../Redux/store";
import {
  accessTokenKey,
  googleLoginKey,
  googleLoginValue,
  roles,
} from "../Utils/tokenKeyValue";
import http from "./httpService";
import Cookies from "js-cookie";

const apiEndpoint = "/auth";

// =====|  User Service  |=====

const UserService = {
  // login: (userData: any) => http.post(`${apiEndpoint}/login-installer`, userData),
  login: (userData: any) => http.post(`${apiEndpoint}/login`, userData),
  signUp: (userData: any) => http.post(`${apiEndpoint}/signup`, userData),
  verifyEmail: (userId: string, token: string) =>
    http.put(`${apiEndpoint}/verify-email/${userId}/${token}`),
  resendVerifyEmail: (userId: string) =>
    http.post(`${apiEndpoint}/resend-verification/${userId}`),
  verifyTokenService: (token: string) =>
    http.get(`${apiEndpoint}/decode-referral-link/${token}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const loginUser =
  (data: { email: string; password: string }) =>
  async (): Promise<any | void> => {
    // const { data: user }: any = await UserService.login(data);
    // console.log("User: ", user);

    // if (user?.access_token !== "An Email sent to your account please verify") setJwtToken(user?.access_token);

    // return user;

    const { user, token }: any = await UserService.login(data);

    if (user?._id) {
      if (token) setJwtToken(token);

      // const userForRedux = getUserObjectForRedux(user);
      // dispatch(saveUserState(userForRedux));
      // dispatch(resetStoryState());
      // dispatch(fetchVoices());
    }

    return user;
  };

export const signUpUser =
  (userData: UserState, isSocialLogin?: boolean) =>
  async (dispatch: AppDispatch): Promise<any> => {
    try {
      const data = {
        name: userData.name,
        email: userData.email?.toLowerCase(),
        password: userData.password,
        address: userData.address,
        electricity_usage: userData.bill,
        imageUrl: userData.picture ?? "",
        ...(isSocialLogin
          ? {
              googleId: userData.id,
              isgooglesignup: true,
            }
          : {}),
      };

      const { data: user } = await UserService.signUp(data);

      if (user) {
        if (isSocialLogin) {
          // we're only setting token for google users, because other users have to verify their emails first
          setJwtToken(user?.access_token);
        }

        if (user?.user?.user) {
          const userForRedux = {
            id: user?.user?.user?._id,
            bill: user?.user?.user?.power_usage?.toString(),
            address: user?.user?.user?.address,
            name: user?.user?.user?.name,
            email: user?.user?.user?.email,
            role: user?.user?.user?.role,
            picture: user?.user?.user?.imageUrl || userData.picture || "",
          };
          dispatch(saveUserState(userForRedux));
        }
      }

      return user;
    } catch (error) {
      console.error("signUpUser (API): ", error);
      throw error;
    }
  };

export const verifyEmail = async (
  userId: string,
  token: string
): Promise<any | void> => {
  return UserService.verifyEmail(userId, token);
};

export const resendVerifyEmail = async (
  userId: string
): Promise<any | void> => {
  return UserService.resendVerifyEmail(userId);
};

export const setJwtToken = (token: string) => {
  const decodedToken: any = jwtDecode(token);
  const timestampInSeconds = decodedToken.exp;
  const timestampInMilliseconds = timestampInSeconds * 1000;
  const currentTimestamp = Date.now();
  const timeDifference = timestampInMilliseconds - currentTimestamp;
  const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
  const expiryDays = daysDifference.toFixed(0) ?? 1;

  Cookies.set(accessTokenKey, token, { expires: parseInt(expiryDays) });
};

export const getJwtToken = (): string => {
  return Cookies.get(accessTokenKey) ?? "";
};

export const getAuthHeader = () => {
  return { Authorization: `Bearer ${getJwtToken()}` };
};

export const isUserLoggedIn = (): boolean => {
  return !!Cookies.get(accessTokenKey);
};

export const isGoogleLoggedIn = (): boolean => {
  try {
    return localStorage.getItem(googleLoginKey) === googleLoginValue;
  } catch (ex) {
    return false;
  }
};

export const setGoogleLoggedIn = () => {
  localStorage.setItem(googleLoginKey, googleLoginValue);
};

export const logoutUser = () => {
  Cookies.remove(accessTokenKey);
  localStorage.removeItem(googleLoginKey);
};

const getLoggedInUser = (): null | { role: string } => {
  if (!isUserLoggedIn()) return null;

  try {
    const loggedInUser: any = jwtDecode(Cookies.get(accessTokenKey) || "");
    return loggedInUser;
  } catch (ex) {
    return null;
  }
};

// export const isAdminLoggedIn = (): boolean => {
//   const loggedInUser: any = getLoggedInUser();
//   return loggedInUser?.role === roles.INSTALLER_ADMIN || false;
// };

export const isOfficeManagerLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.OFFICE_MANAGER || false;
};

export const isManagerLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.MANAGER || false;
};

export const isRepresentativeLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.REPRESENTATIVE || false;
};

// TODO: change the name to isAdminLoggedIn
export const isSuperAdminLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.ADMIN || false;
};

export const isBrandLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.BRAND || false;
};

export const isDirectorLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.DIRECTOR || false;
};

export const isAdminManagerLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.ADMIN_MANGER || false;
};

export const isPslLoggedIn = (): boolean => {
  const loggedInUser: any = getLoggedInUser();
  return loggedInUser?.role === roles.PSL || false;
};

export const verifyTokenService = (data: any) => {
  return UserService.verifyTokenService(data);
};
