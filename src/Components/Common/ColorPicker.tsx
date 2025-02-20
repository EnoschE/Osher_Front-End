import React from "react";
import { Box, Popover } from "@mui/material";
import { BlockPicker } from "react-color";
import { borderRadius } from "../../Utils/spacings";

interface ColorPickerPopupProps {
	color?: string;
	onChange?: (color: string) => void;
	disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerPopupProps> = ({ color = "", onChange, disabled }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (!disabled) {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleClose = () => setAnchorEl(null);

	const handleColorChange = (color: any) => {
		handleClose();
		onChange?.(color.hex);
	};

	return (
		<>
			<Box
				sx={{
					cursor: "pointer",
					display: "inline-block",
					width: 36,
					py: 4,
				}}
				onClick={handleClick}
			>
				<Box
					sx={{
						width: 36,
						height: 36,
						borderRadius: borderRadius.sm,
						backgroundColor: color,
						border: "1px solid lightgray",
					}}
				/>
			</Box>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					// horizontal: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					// horizontal: "center",
					horizontal: "left",
				}}
			>
				<Box>
					<BlockPicker
						triangle="hide"
						color={color}
						onChangeComplete={handleColorChange}
						colors={[
							"#f44336",
							"#e91e63",
							"#9c27b0",
							"#673ab7",
							"#3f51b5",
							"#2196f3",
							"#03a9f4",
							"#00bcd4",
							"#009688",
							"#4caf50",
							"#8bc34a",
							"#cddc39",
							"#ffc107",
							"#ff9800",
							"#ff5722",
							"#1C1D34",
							"#475467",
							"#090F4E",
							"#060a22",
							"#323421",
						]}
					/>
				</Box>
			</Popover>
		</>
	);
};

export default ColorPicker;
