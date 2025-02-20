import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { LoadScript } from "@react-google-maps/api";
import Loader from "./Components/Common/Loader";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<LoadScript
				googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY ?? ""}
				libraries={["places", "marker"]}
				loadingElement={<Loader />}
			>
				<Provider store={store}>
					<App />
				</Provider>
			</LoadScript>
		</BrowserRouter>
	</React.StrictMode>,
);
