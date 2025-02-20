import { Checkbox, FormControlLabel, Typography } from "@mui/material";

interface CustomCheckBoxProps {
	top?: string | number;
	bottom?: string | number;
	checked?: boolean;
	onChange?: any;
	disabled?: boolean;
	text?: string | any;
	startElement?: any;
	endElement?: any;
	checkboxStyle?: any;
	checkboxClassName?: string;
	indeterminate?: boolean;
	className?: string;
}

// const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
const CustomCheckBox = ({
	top = 0,
	bottom = 0,
	checked,
	onChange,
	disabled,
	text,
	startElement,
	endElement,
	checkboxStyle,
	indeterminate,
	className,
}: CustomCheckBoxProps) => {
	return (
		<FormControlLabel
			className={className}
			style={{ marginTop: top, marginBottom: bottom }}
			control={
				<Checkbox
					size="small"
					color="primary"
					disabled={disabled}
					checked={checked ?? false}
					onChange={onChange}
					indeterminate={indeterminate}
					style={{ ...checkboxStyle }}
				/>
			}
			label={
				<span style={{ display: "flex", alignItems: "center" }}>
					{startElement ? startElement : ""}
					<Typography variant="body2">{text}</Typography>
					{endElement ? endElement : ""}
				</span>
			}
		/>
	);
};

export default CustomCheckBox;
