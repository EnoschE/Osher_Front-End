import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import { tokenKey, value } from "../../Utils/tokenKeyValue";

describe("Home", () => {
	const mockRemoveItem = jest.fn();
	const mockNavigate = jest.fn();

	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: mockRemoveItem,
			},
			writable: true,
		});

		jest.mock("react-router-dom", () => ({
			...jest.requireActual("react-router-dom"),
			useNavigate: () => mockNavigate,
		}));
	});

	it("renders the Home component with the welcome message", () => {
		render(
			<Router>
				<Home />
			</Router>,
		);

		const welcomeMessage = screen.getByText(/Welcome to the home page!/i);
		expect(welcomeMessage).toBeInTheDocument();
	});

	it("renders the logout button", () => {
		render(
			<Router>
				<Home />
			</Router>,
		);

		const logoutButton = screen.getByRole("button", { name: /Logout/i });
		expect(logoutButton).toBeInTheDocument();
	});

	it("calls handleLogout function and navigates to '/login' when logout button is clicked", () => {
		localStorage.setItem(tokenKey, value);

		render(
			<Router>
				<Home />
			</Router>,
		);

		const logoutButton = screen.getByRole("button", { name: /Logout/i });
		fireEvent.click(logoutButton);

		expect(mockRemoveItem).toHaveBeenCalledWith(tokenKey);

		setTimeout(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/login");
		}, 0);
	});
});
