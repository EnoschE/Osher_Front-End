import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { PublicRoute } from "./PublicRoutes";
import { tokenKey } from "../Utils/tokenKeyValue";

describe("PublicRoute", () => {
	it("renders the children when there is no authentication token", () => {
		localStorage.removeItem(tokenKey);

		render(
			<Router>
				<PublicRoute>
					<div data-testid="children-component">Children Component</div>
				</PublicRoute>
			</Router>,
		);
		expect(screen.getByTestId("children-component")).toBeInTheDocument();
	});

	it('redirects to "/home" when there is an authentication token', () => {
		localStorage.setItem(tokenKey, "some-auth-token");

		render(
			<Router>
				<PublicRoute>
					<div data-testid="children-component">Children Component</div>
				</PublicRoute>
			</Router>,
		);
		expect(screen.queryByTestId("children-component")).toBeNull();
		expect(window.location.pathname).toEqual("/home");
		localStorage.removeItem(tokenKey);
	});
});
