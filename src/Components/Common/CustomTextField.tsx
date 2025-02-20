import React, { useState } from "react";
import { TextField, InputAdornment, Typography, TextFieldVariants, Box, InputProps, IconButton } from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

type InputTypes = "text" | "number" | "search" | "password" | "email";
interface CustomTextFieldProps {
	className?: string;
	error?: string;
	name?: string;
	type?: InputTypes;
	variant?: TextFieldVariants;
	label?: string;
	placeholder?: string;
	value?: string | number;
	onChange?: any;
	onFocus?: any;
	width?: string | number;
	top?: string | number;
	bottom?: string | number;
	left?: string | number;
	right?: string | number;
	style?: any;
	inputStyle?: any;
	disabled?: boolean;
	InputProps?: InputProps;
	startIcon?: any;
	endIcon?: any;
	multiline?: boolean;
	minRows?: number;
	maxRows?: number;
	noHelperText?: boolean;
	autoFocus?: boolean;
	displayPasswordIcon?: boolean;
	inputProps?: any;
	autoComplete?: any;
	onKeyDown?:any;
	onBlur?:any;
	onKeyUp?:any;
	
}

export const Asterisk = () => {
	return (
		<Box component="span" sx={{ color: "error.main" }}>
			{" "}
			*
		</Box>
	);
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
	className,
	error,
	type = "text",
	variant = "outlined",
	label,
	placeholder,
	value,
	onChange,
	onFocus,
	width = "100%",
	top = 0,
	bottom = 0,
	left = 0,
	right = 0,
	style, // style of parent container on input field
	inputStyle, // style of input field
	disabled,
	InputProps = {},
	startIcon,
	endIcon,
	multiline, // Boolean to make the input field multiline
	minRows = 2, // minimum number of rows for bigInput
	maxRows = 7, // maximum number of rows for bigInput
	noHelperText, // Boolean to hide error message
	displayPasswordIcon,
	...rest
}) => {
	const isPasswordField = type === "password";
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Box
			style={{
				display: "flex",
				flexDirection: "column",
				width: width,
				marginTop: top,
				marginBottom: bottom,
				marginLeft: left,
				marginRight: right,
				...style,
			}}
		>
			{label && (
				<Typography mb={10} variant="h6">
					{label}
				</Typography>
			)}
			<TextField
				className={className}
				variant={variant}
				type={isPasswordField && showPassword ? "text" : type}
				value={value ?? ""}
				placeholder={placeholder}
				helperText={noHelperText ? undefined : error}
				error={error ? true : false}
				onChange={onChange}
				style={{ marginTop: 0, width: "100%", ...inputStyle }}
				disabled={disabled}
				multiline={multiline}
				minRows={minRows}
				maxRows={maxRows}
				onFocus={onFocus}
				InputProps={{
					startAdornment: startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : null,
					endAdornment:
						endIcon || isPasswordField ? (
							<InputAdornment position="end">
								{isPasswordField && displayPasswordIcon ? (
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={(e: any) => e.preventDefault()}
									>
										{showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
									</IconButton>
								) : (
									endIcon
								)}
							</InputAdornment>
						) : null,
					...InputProps,
				}}
				{...rest}
			/>
		</Box>
	);
};

export default CustomTextField;
