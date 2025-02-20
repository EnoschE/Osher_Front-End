import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../Services/userService";
import { allRoutes } from "./AllRoutes";

export const PublicRoute = ({ children }: { children: any }) => {
	return !isUserLoggedIn() ? children : <Navigate to={allRoutes.DASHBOARD} replace={true} />;
};
