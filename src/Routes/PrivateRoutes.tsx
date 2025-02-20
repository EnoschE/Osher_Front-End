import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../Services/userService";
import { allRoutes } from "./AllRoutes";

export const PrivateRoute = ({ children }: { children: any }) => {
	return isUserLoggedIn() ? children : <Navigate to={allRoutes.HOME} replace={true} />;
};
