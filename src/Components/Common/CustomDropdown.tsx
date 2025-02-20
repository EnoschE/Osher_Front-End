import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ExpandMoreRounded } from "@mui/icons-material";
import { FormHelperText } from "@mui/material";

interface OptionProps {
	text: string;
	value: string | number;
	disabled?: boolean;
}

interface CustomDropdownProps {
	label?: string;
	options?: Array<OptionProps>;
	value?: string;
	disabled?: boolean;
	minWidth?: string | number;
	onChange?: (value: string) => void;
	isLargeDropdown?: boolean;
	error?: string;
	defaultSelectable? : boolean;
}

const CustomDropdown = ({
	value,
	onChange,
	disabled,
	label,
	options,
	minWidth = 160,
	isLargeDropdown,
	error,
	defaultSelectable
}: CustomDropdownProps) => {
	const handleChange = (event: SelectChangeEvent) => {
		onChange?.(event.target.value);
	};

	return (
		<FormControl sx={{ m: 1, minWidth: isLargeDropdown ? { xs: "100%", md: 560 } : minWidth }} error={!!error}>
			<Select
				value={value}
				onChange={handleChange}
				displayEmpty
				disabled={disabled}
				inputProps={{ "aria-label": "Custom Dropdown" }}
				IconComponent={ExpandMoreRounded}
				sx={
					isLargeDropdown
						? {
								"& .MuiSelect-outlined": {
									paddingBlock: "21px !important",
								},
								"& .MuiSelect-nativeInput": {
									paddingBlock: 21,
								},
						  }
						: {}
				}
			>
				{!!label && (
					<MenuItem value="" disabled={!defaultSelectable}>
						{label}
					</MenuItem>
				)}
				{options?.map((option) => (
					<MenuItem key={option.value} value={option.value} disabled={option.disabled}>
						{option.text}
					</MenuItem>
				))}
			</Select>
			{!!error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
};
export default CustomDropdown;
