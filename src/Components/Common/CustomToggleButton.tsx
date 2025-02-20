import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	"&.MuiToggleButtonGroup-root": {
		margin: theme.spacing(0.5),
		backgroundColor: theme.palette.secondary.main,
		border: `1px solid ${theme.palette.secondary.main}`,
		padding: 6,
		gap: 6,
		borderRadius: borderRadius.sm,

		"& .MuiButtonBase-root": {
			borderRadius: borderRadius.sm,
			paddingInline: 32,
			paddingBlock: 10,
			fontSize: 16,
			fontWeight: 500,
			textTransform: "unset",
			border: 0,
			color: theme.palette.text.primary,

			"&.Mui-selected": {
				backgroundColor: theme.palette.primary.main,
				color: "white",
			},

			"&.Mui-disabled": {
				opacity: 0.5,
			},
		},
	},
}));

interface OptionProps {
	text: string | number;
	value: string | number | boolean;
}

interface CustomToggleButtonProps {
	isDarkMode?: boolean;
	value?: string | number;
	onChange?: (value: number | string) => void;
	options?: Array<OptionProps>;
}

const CustomToggleButton = ({ isDarkMode, value, onChange, options = [] }: CustomToggleButtonProps) => {
	const handleAlignment = (event: React.MouseEvent<HTMLElement>, newValue: string | number) => {
		if (newValue) {
			onChange?.(newValue);
		}
	};

	return (
		<StyledToggleButtonGroup
			style={isDarkMode ? { backgroundColor: "transparent", borderColor: "white" } : {}}
			value={value}
			exclusive
			onChange={handleAlignment}
			aria-label="custom toggle button"
		>
			{options?.map((option, index) => (
				<ToggleButton key={index} value={option.value} style={isDarkMode ? { color: "white" } : {}}>
					{option.text}
				</ToggleButton>
			))}
		</StyledToggleButtonGroup>
	);
};

export default CustomToggleButton;
