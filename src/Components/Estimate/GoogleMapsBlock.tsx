import axios from "axios";
import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { borderRadius } from "../../Utils/spacings";
import { toast } from "react-toastify";
import { PlaceType } from "../Common/GoogleMapsTextField";
import { Theme, useMediaQuery } from "@mui/material";

const mapOptions = {
	disableDefaultUI: true,
	zoomControl: true,
	mapTypeId: "hybrid",
	labels: true,
};

export interface LocationInterface {
	lat: number;
	lng: number;
}

interface GoogleMapsBlockProps {
	address?: PlaceType | null;
	updateAddress?: any;
	showCurrentLocation?: boolean;
	showLocationFromMap?: () => void;
}

export const convertLatLangToAddress = async (newPosition: LocationInterface) => {
	const googleRestrictedApiKey = process.env.REACT_APP_GOOGLE_API_KEY_UNRESTRICTED ?? "";
	try {
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newPosition.lat},${newPosition.lng}&key=${googleRestrictedApiKey}`,
		);

		if (response.data.results.length > 0) {
			const result = response.data.results[0];

			const addressObject = {
				description: result.formatted_address,
				structured_formatting: {
					main_text: result.formatted_address,
					secondary_text: result.formatted_address,
				},
			};

			return addressObject;
		} else return null;
	} catch (error) {
		console.error("Error fetching reverse geocode data:", error);
		return null;
	}
};

export const getMyLocation = async (): Promise<{ location: LocationInterface | null; address: any } | null> => {
	if (!navigator.geolocation) {
		console.error("Geolocation is not supported by this browser.");
		toast.error("Geolocation is not supported by this browser.");
		return null;
	}

	try {
		const position: GeolocationPosition = await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});

		const location = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};

		const address = await convertLatLangToAddress(location);

		return { location, address };
	} catch (error) {
		console.error("Error fetching location:", error);
		return null;
	}
};

const GoogleMapsBlock: React.FC<GoogleMapsBlockProps> = ({
	address,
	updateAddress,
	showCurrentLocation,
	showLocationFromMap,
}) => {
	const googleRestrictedApiKey = process.env.REACT_APP_GOOGLE_API_KEY_UNRESTRICTED ?? "";
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	const [currentLocation, setCurrentLocation] = useState({ lat: 42.358777, lng: -71.06381 });
	const [markerPosition, setMarkerPosition] = useState(currentLocation);

	const containerStyle = {
		width: "100%",
		height: "100%",
		borderRadius: isSmallScreen ? borderRadius.sm : borderRadius.xl,
	};

	useEffect(() => {
		getPosition();
	}, [address, showCurrentLocation]);

	const getPosition = async () => {
		if (address && !showCurrentLocation) {
			convertAddressToLatLang();
		} else {
			getCurrentPosition();
		}
	};

	const getCurrentPosition = async () => {
		const output: { location: LocationInterface | null; address: any } | null = await getMyLocation();
		const { location, address: convertedAddress } = output || {};

		if (location) {
			setCurrentLocation(location);
			setMarkerPosition(location); // Set the marker's initial position

			if (showCurrentLocation) {
				showLocationFromMap?.();
				if (convertedAddress) {
					updateAddress(convertedAddress);
				}
			}
		} else {
			console.error("Error fetching location...");
		}
	};

	// TODO: move this to googleService
	const convertAddressToLatLang = async () => {
		if (address) {
			try {
				const response = await axios.get(
					`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
						address.description,
					)}&key=${googleRestrictedApiKey}`,
				);

				if (response.data.results.length > 0) {
					const location = response.data.results[0].geometry.location;
					setCurrentLocation({
						lat: location.lat,
						lng: location.lng,
					});
					setMarkerPosition({
						lat: location.lat,
						lng: location.lng,
					});
				}
			} catch (error) {
				console.error("Error fetching geocode data:", error);
			}
		}
	};

	const handleMapClick = async (event: google.maps.MapMouseEvent) => {
		if (event.latLng) {
			const newPosition = {
				lat: event.latLng.lat(),
				lng: event.latLng.lng(),
			};
			setMarkerPosition(newPosition);

			const converted = await convertLatLangToAddress(newPosition);
			if (converted) {
				updateAddress(converted);
			}
		}
	};

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={currentLocation}
			zoom={18.5}
			options={mapOptions}
			onClick={handleMapClick}
		>
			<MarkerF position={markerPosition} draggable={true} onDragEnd={handleMapClick} />
		</GoogleMap>
	);
};

export default GoogleMapsBlock;
