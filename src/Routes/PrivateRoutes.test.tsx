import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoutes";
import { tokenKey } from "../Utils/tokenKeyValue";

describe("PrivateRoute", () => {
	it("renders children when token is present", () => {
		localStorage.setItem(tokenKey, "some-auth-token");
		render(
			<Router>
				<PrivateRoute
				// token={key}
				>
					<div>Child Component</div>
				</PrivateRoute>
			</Router>,
		);
		const childComponent = screen.queryByText("Child Component");
		expect(childComponent).toBeInTheDocument();
	});

	it("redirects to login when token is not present", () => {
		localStorage.removeItem(tokenKey);
		render(
			<Router>
				<PrivateRoute
				// token={null}
				>
					<div>Child Component</div>
				</PrivateRoute>
			</Router>,
		);
		expect(screen.queryByText("Child Component")).toBeNull();
		expect(window.location.pathname).toEqual("/login");
	});
});
