import RouteNavigation from "./Routes/RouteNavigation";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./ToastStyles.css";
import "chart.js/auto";
// import { useSelector } from "./Redux/reduxHooks";
// import { selectColors } from "./Redux/Slices/generalSlice";
import createAppTheme from "./theme";

const App = () => {
  // const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH_ID ?? "";
  const theme = createAppTheme();

  return (
    <ThemeProvider theme={theme}>
      {/* <GoogleOAuthProvider clientId={googleClientId}> */}
        <RouteNavigation />
        <ToastContainer hideProgressBar autoClose={2500} />
      {/* </GoogleOAuthProvider> */}
    </ThemeProvider>
  );
};

export default App;
