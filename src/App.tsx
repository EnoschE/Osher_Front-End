import RouteNavigation from "./Routes/RouteNavigation";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import createAppTheme from "./theme";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./ToastStyles.css";

const App = () => {
  const theme = createAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <RouteNavigation />
      <ToastContainer hideProgressBar autoClose={2500} />
    </ThemeProvider>
  );
};

export default App;
