import Navbar from "../Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SetPasswordDialog from "./SetPasswordDialog";
import { useEffect, useState } from "react";
import { allRoutes } from "../../Routes/AllRoutes";
import { Box } from "@mui/material";
import { navbarHeight } from "../../Utils/spacings";

const ResetPassword = () => {
	const navigate = useNavigate();
	const { token, userId } = useParams();

	const [setPasswordDialog, setSetPasswordDialog] = useState<boolean>(false);

	useEffect(() => {
		if (token || userId) {
			openSetPasswordDialog();
		} else {
			navigate(allRoutes.HOME);
		}
	}, []);

	const openSetPasswordDialog = () => setSetPasswordDialog(true);
	const closeSetPasswordDialog = () => navigate(allRoutes.HOME);

	return (
		<>
			<Navbar />
			<Box sx={{ width: "100vw", height: `100vh - ${navbarHeight}` }} />
			<SetPasswordDialog token={token} userId={userId} open={setPasswordDialog} onClose={closeSetPasswordDialog} />
		</>
	);
};

export default ResetPassword;
