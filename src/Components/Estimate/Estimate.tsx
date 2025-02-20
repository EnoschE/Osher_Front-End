import { FormEvent, useEffect, useState } from "react";
import { Box, ListItem, Theme, Typography, useMediaQuery } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import CustomTextField from "../Common/CustomTextField";
import GoogleMapsTextField, { PlaceType } from "../Common/GoogleMapsTextField";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { EstimateContainer } from "./estimateStyles";
import { useDispatch, useSelector } from "react-redux";
import { saveAddressObject, saveBill, selectUser } from "../../Redux/Slices/userSlice";
import CustomButton from "../Common/CustomButton";
import Loader from "../Common/Loader";
import { verifyAddress } from "../../Services/addressService";
import { toast } from "react-toastify";
import GoogleMapsBlock from "./GoogleMapsBlock";
import { NearMeOutlined } from "@mui/icons-material";

const Estimate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	const [address, setAddress] = useState<PlaceType | null>(null);
	const [bill, setBill] = useState<number | string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [showCurrentLocation, setShowCurrentLocation] = useState<boolean>(false);

	useEffect(() => {
		if (user.bill) setBill(user.bill);
		if (user.addressObject) setAddress(user.addressObject);
	}, []);

	const handleAddress = (value: PlaceType | null) => {
		setAddress(value);
	};

	const handleBill = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (parseFloat(value) > 0 || value === "") setBill(value);
	};

	const handleNext = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		try {
			const { data }: any = await verifyAddress(address?.description ?? "");
			console.log("data", data);

			if (data.Isvalid === "Something went wrong") {
				toast.warn("We are sorry, but we are currently not operating in your area. Please try again in a few months.");
			} else if (data.Isvalid) {
				// storing address and bill in redux for future use
				dispatch(saveAddressObject(address));
				dispatch(saveBill(bill));

				navigate(allRoutes.SOLAR_REPORT);
				// navigate(allRoutes.SIGNUP);
			} else {
				toast.error("Enter a valid address!");
			}
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleShowCurrentLocation = () => {
		setShowCurrentLocation(true);
	};

	const showLocationFromMap = () => {
		setShowCurrentLocation(false);
	};

	// TODO: move loader into Navbar component
	// TODO in future: update favicon

	return (
		<>
			<Navbar />
			<Loader open={loading} />
			<EstimateContainer>
				<Box>
					<Typography variant={isMobileView ? "h3" : "h2"}>Free Solar Quote</Typography>
					<Typography mt={10} mb={24}>
						Please enter your home details for an instant solar quote. Make sure the pin is on your home.
					</Typography>
					<form onSubmit={handleNext}>
						<GoogleMapsTextField label="Home Address" value={address} onChange={handleAddress} />

						<Box display="flex" alignItems="center" justifyContent="flex-end" mt={8}>
							<ListItem disablePadding button sx={{ width: "auto", borderRadius: 4 }}>
								<Typography
									gap={4}
									className="link"
									display="inline-flex"
									alignItems="center"
									onClick={handleShowCurrentLocation}
								>
									<NearMeOutlined sx={{ height: 14, width: 14 }} /> Use my current location
								</Typography>
							</ListItem>
						</Box>

						<CustomTextField
							type="number"
							label="Monthly Electric Bill"
							value={bill}
							onChange={handleBill}
							top={20}
							bottom={20}
							endIcon={<>/Mo</>}
							inputProps={{ min: 1 }}
						/>

						<CustomButton type="submit" fullWidth disabled={!address || !bill}>
							Next
						</CustomButton>
					</form>

					<Typography textAlign="center" mt={32}>
						Existing User?{" "}
						<span className="link" onClick={() => navigate(allRoutes.HOME)}>
							Login
						</span>
					</Typography>
				</Box>

				<Box className="maps-block">
					<GoogleMapsBlock
						address={address}
						updateAddress={handleAddress}
						showCurrentLocation={showCurrentLocation}
						showLocationFromMap={showLocationFromMap}
					/>
				</Box>
			</EstimateContainer>
		</>
	);
};

export default Estimate;
