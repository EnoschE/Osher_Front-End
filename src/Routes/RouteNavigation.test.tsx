import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { setupServer } from "msw/node";
import { handlers } from "../Mocks/server";
import RouteNavigation from "./RouteNavigation";
import { tokenKey, value } from "../Utils/tokenKeyValue";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("RouteNavigation", () => {
	it("renders the SignUp component on initial route", () => {
		render(
			<Router>
				<RouteNavigation />
			</Router>,
		);
		expect(screen.getByRole("heading", { name: /SignUp/i })).toBeInTheDocument();
	});

	it('renders the SignUp component on "/register" route', () => {
		render(
			<Router>
				<RouteNavigation />
			</Router>,
		);
		expect(screen.getByRole("heading", { name: /SignUp/i })).toBeInTheDocument();
	});

	it('renders the Login component on "/login" route', () => {
		render(
			<Router>
				<RouteNavigation />
			</Router>,
		);
		expect(screen.getByTestId("email-input")).toBeInTheDocument();
		expect(screen.getByTestId("password-input")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
		expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Log In/i })).toBeInTheDocument();
	});

	it('renders the Home component on "/home" route when authenticated', () => {
		localStorage.setItem(tokenKey, value);

		render(
			<Router>
				<RouteNavigation />
			</Router>,
		);
		expect(screen.getByRole("heading", { name: /Welcome to the home page!/i })).toBeInTheDocument();
		localStorage.removeItem(tokenKey);
	});

	it('redirects to Login component on "/home" route when unauthenticated', () => {
		render(
			<Router>
				<RouteNavigation />
			</Router>,
		);
		expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
	});
});
