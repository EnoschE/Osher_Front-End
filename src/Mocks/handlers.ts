import { rest } from "msw";
import { isUserLoggedIn } from "../Services/userService";

export const handlers = [
	// Mock handler for successful authentication
	rest.get("/home", (req, res, ctx) => {
		const loggedIn = isUserLoggedIn();
		if (loggedIn) {
			return res(
				ctx.status(200),
				ctx.json({
					message: "Authentication successful",
				}),
			);
		} else {
			return res(
				ctx.status(401),
				ctx.json({
					message: "Authentication failed",
				}),
			);
		}
	}),

	// Mock handler for login (unauthenticated) route
	rest.get("/login", (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				message: "You are on the login page",
			}),
		);
	}),
];
