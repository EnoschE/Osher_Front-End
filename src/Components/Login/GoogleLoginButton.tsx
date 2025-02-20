import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import CustomButton from "../Common/CustomButton";
import { GoogleIcon } from "../../Utils/icons";
import { loginUser, setGoogleLoggedIn, signUpUser } from "../../Services/userService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { getGoogleProfile, getProfile } from "../../Services/profileService";

interface GoogleLoginButtonProps {
	text?: string;
	onSuccess?: (isSocialLogin: boolean) => void;
	onFailure?: () => void;
	isSignUpButton?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
	text = "Sign in with Google",
	onSuccess,
	onFailure,
	isSignUpButton,
}) => {
	const dispatch = useDispatch();
	const userState = useSelector(selectUser);

	const handleGoogleSignInSuccess = async (response: any) => {
		console.table("Google login successful:", response);
		try {
			if (response.access_token) {
				const profile = await getGoogleProfile(response.access_token);
				setGoogleLoggedIn();

				const userData = {
					id: profile.id,
					name: profile.name,
					email: profile.email,
					password: "",
					address: userState.address,
					bill: userState.bill,
					addressObject: userState.addressObject,
					role: "",
					picture: profile.picture,
				};

				if (isSignUpButton) {
					await dispatch(signUpUser(userData, true));
					await dispatch(getProfile());
				} else {
					const user = await dispatch(loginUser({ email: profile.email, password: "" }));

					if (user.access_token === "An Email sent to your account please verify") {
						return toast.warn(
							"An email has been sent to your account. Please check your inbox and verify your email address.",
						);
					}
				}

				onSuccess?.(true);
			}
		} catch (error: any) {
			let specificError = error;
			if (specificError === "User already exists with this email") {
				specificError = "Email already in use. Please try logging in.";
			}
			toast.error(specificError);
		}
	};

	const handleGoogleSignInFailure = (error: any) => {
		console.error("Google login failed:", error);
		onFailure?.();
	};

	const login = useGoogleLogin({
		onSuccess: handleGoogleSignInSuccess,
		onError: handleGoogleSignInFailure,
	});

	return (
		<CustomButton
			variant="outlined"
			color="secondary"
			startIcon={<GoogleIcon height={20} width={20} />}
			onClick={() => login()}
		>
			{text}
		</CustomButton>
	);
};

export default GoogleLoginButton;
