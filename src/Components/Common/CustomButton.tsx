import { Button, ButtonProps } from "@mui/material";
import * as React from "react";

const CustomButton: React.FC<ButtonProps> = (props) => {
	return (
		<Button variant="contained" {...props}>
			{props.children}
		</Button>
	);
};

export default CustomButton;
