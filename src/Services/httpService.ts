import axios from "axios";
import { logoutUser } from "./userService";
import { toast } from "react-toastify";

const http = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token Expired: ", error);
      logoutUser();
      toast.warn("Token has been expired. Please login again.");
    } else {
      throw error.response?.data || "Something went wrong!";
    }
  }
);

export default http;
