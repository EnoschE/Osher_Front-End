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
import { useEffect, useState } from "react";
import { fetchCategories } from "./Redux/Slices/categoriesSlice";

const App = () => {
  // const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH_ID ?? "";
  const theme = createAppTheme();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   setLoading(true);
  //   await fetchCategories();
  //   setLoading(false);
  // };

  return (
    <ThemeProvider theme={theme}>
      {/* <GoogleOAuthProvider clientId={googleClientId}> */}
      {/* {loading ? <></> : <RouteNavigation />} */}
      <RouteNavigation />
      <ToastContainer hideProgressBar autoClose={2500} />
      {/* </GoogleOAuthProvider> */}
    </ThemeProvider>
  );
};

export default App;
