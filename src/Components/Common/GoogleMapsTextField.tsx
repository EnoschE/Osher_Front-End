import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { LocationSearchingOutlined } from "@mui/icons-material";
import { LocationInterface, getMyLocation } from "../Estimate/GoogleMapsBlock";

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
	offset: number;
	length: number;
}
interface StructuredFormatting {
	main_text: string;
	secondary_text: string;
	main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
	description: string;
	structured_formatting: StructuredFormatting;
	houseNo?: string;
	fullAddress?: string;
}

interface GoogleMapsTextFieldProps {
	label?: string;
	error?: string;
	placeholder?: string;
	value?: PlaceType | null;
	onChange?: any;
}

const GoogleMapsTextField = ({ error, placeholder, label, value = null, onChange }: GoogleMapsTextFieldProps) => {
	const [internalValue, setInternalValue] = useState<PlaceType | null | undefined>(value);
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState<readonly PlaceType[]>([]);

	const fetch = useMemo(
		() =>
			debounce((request: { input: string }, callback: (results?: readonly PlaceType[]) => void) => {
				// Modify the request to include componentRestrictions and types
				const modifiedRequest = {
					...request,
					componentRestrictions: {
						country: "US", // Limit to US addresses
						// administrativeArea: ["NY", "NM", "MA"],
						// administrativeArea: ["NY"],
					},
					// types: ["geocode"], // Include home/apartment/building addresses
					types: ["address"], // Only fetch addresses
				};

				(autocompleteService.current as any).getPlacePredictions(modifiedRequest, callback);
			}, 400),
		[],
	);

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	useEffect(() => {
		let active = true;

		if (!autocompleteService.current && (window as any).google?.maps?.places) {
			autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
		}
		if (!autocompleteService.current) {
			return undefined;
		}

		if (inputValue === "") {
			setOptions(internalValue ? [internalValue] : []);
			return undefined;
		}

		fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
			if (active) {
				let newOptions: readonly PlaceType[] = [];

				if (internalValue) newOptions = [internalValue];

				if (results) newOptions = [...newOptions, ...results];

				setOptions(newOptions);
			}
		});

		return () => {
			active = false;
		};
	}, [internalValue, inputValue, fetch]);

	const handleSelectMyLocation = async (event: React.MouseEvent<HTMLOrSVGElement>) => {
		event.stopPropagation();
		try {
			const output: { location: LocationInterface | null; address: any } | null = await getMyLocation();
			const { address } = output || {};
			if (address) onChange(address);
		} catch (error) {
			console.log("Error while fetching location: ", error);
		}
	};

	return (
		<>
			{!!label && (
				<Typography variant="h6" mb={10}>
					{label}
				</Typography>
			)}
			<Autocomplete
				id="google-map-demo"
				fullWidth
				getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
				filterOptions={(x) => x}
				options={options}
				autoComplete
				includeInputInList
				filterSelectedOptions
				value={internalValue}
				noOptionsText="Enter your home address"
				onChange={(event: any, newValue: PlaceType | null) => {
					setOptions(newValue ? [newValue, ...options] : options);
					setInternalValue(newValue);
					onChange?.(newValue);
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				renderInput={(params) => (
					<TextField {...params} placeholder={placeholder} error={!!error} helperText={error} fullWidth />
				)}
				popupIcon={<LocationSearchingOutlined onClick={handleSelectMyLocation} />}
				renderOption={(props, option) => {
					const matches = option.structured_formatting.main_text_matched_substrings || [];

					const parts = parse(
						option.structured_formatting.main_text,
						matches.map((match: any) => [match.offset, match.offset + match.length]),
					);

					return (
						<li {...props}>
							<Grid container alignItems="center">
								<Grid item sx={{ display: "flex", width: 44 }}>
									<LocationOnIcon sx={{ color: "text.secondary" }} />
								</Grid>
								<Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
									{parts.map((part, index) => (
										<Box key={index} component="span" sx={{ fontWeight: part.highlight ? "bold" : "regular" }}>
											{part.text}
										</Box>
									))}
									<Typography variant="body2" color="text.secondary">
										{option.structured_formatting.secondary_text}
									</Typography>
								</Grid>
							</Grid>
						</li>
					);
				}}
			/>
		</>
	);
};

export default GoogleMapsTextField;
