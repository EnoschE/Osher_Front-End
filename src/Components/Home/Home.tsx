import { useLocation, useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { HomeContainer, HomeButton } from "./homeStyles";
import { useEffect, useState } from "react";
import VerifyEmailDialog from "../SignUp/VerifyEmailDialog";

const Home = () => {
	const navigate = useNavigate();
	const { state }: any = useLocation();
	const newAccountCreated = state?.newAccountCreated;

	const [verificationDialog, setVerificationDialog] = useState<boolean>(false);

	useEffect(() => {
		if (newAccountCreated) {
			openVerificationDialog();
		}
	}, []);

	const handleStart = () => {
		navigate(allRoutes.ESTIMATE);
	};

	const openVerificationDialog = () => setVerificationDialog(true);
	const closeVerificationDialog = () => {
		navigate(allRoutes.HOME);
		setVerificationDialog(false);
	};

	return (
		<HomeContainer>
			<HomeButton onClick={handleStart}>START YOUR JOURNEY</HomeButton>
			<VerifyEmailDialog open={verificationDialog} onClose={closeVerificationDialog} />
		</HomeContainer>
	);
};

export default Home;
