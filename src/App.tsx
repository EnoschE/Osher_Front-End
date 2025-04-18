import RouteNavigation from "./Routes/RouteNavigation";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./ToastStyles.css";
import "chart.js/auto";
import createAppTheme from "./theme";

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
