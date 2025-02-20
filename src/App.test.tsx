import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

describe("App", () => {
	it("renders without error", () => {
		render(
			<Router>
				<App />
			</Router>,
		);
	});
});
