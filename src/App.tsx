import RouteNavigation from "./Routes/RouteNavigation";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import createAppTheme from "./theme";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./ToastStyles.css";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  const theme = createAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <RouteNavigation />
          <ToastContainer hideProgressBar autoClose={2500} />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
