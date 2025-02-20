import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import colors from "../../Utils/colors";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { styled } from "@mui/material";

const StyledCalendar = styled(Calendar)(() => ({
	border: "none !important",
	fontFamily: "Inter",
	maxWidth: "100%",
	width: "100%",

	"&.react-calendar": {
		width: "100%",
	},

	"& .react-calendar__navigation__prev2-button, & .react-calendar__navigation__next2-button": {
		display: "none",
	},

	"& .react-calendar__navigation__arrow": {
		borderRadius: "100%",
		aspectRatio: "1/1",
		backgroundColor: colors.primaryMidLight,
		color: colors.primary,
		fontSize: 18,
		fontWeight: 600,
		paddingBottom: 3,
		height: 25,
		width: 25,
		minWidth: 25,
		marginBlock: "auto",
	},

	"& .react-calendar__navigation__label__labelText": {
		fontSize: 22,
		fontWeight: 600,
		color: colors.text,
		fontFamily: "Inter",
	},

	"& .react-calendar__month-view__weekdays__weekday abbr": {
		textDecoration: "none",
		fontSize: 12,
		fontWeight: 500,
		textTransform: "capitalize",
		color: colors.gray,
	},

	"& .react-calendar__month-view__days__day ": {
		aspectRatio: "1/1",
		borderRadius: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		"& abbr": {
			textDecoration: "none",
			fontSize: 19,
			fontWeight: 500,
			fontFamily: "Inter",
			color: colors.textMid,
		},
	},

	"& .react-calendar__tile--active": {
		background: colors.primary,

		"&:enabled:hover": {
			background: colors.primary,
		},
		"&:enabled:focus": {
			background: colors.primary,
		},

		"& abbr": {
			color: "white",
		},
	},

	"& .react-calendar__tile--now": {
		background: colors.primaryLight,

		"&:enabled:hover": {
			background: colors.primary,
		},
		"&:enabled:focus": {
			background: colors.primary,
		},

		"& abbr": {
			color: "white",
		},
	},
}));

type ValuePiece = Date | null;

type DateValue = ValuePiece | [ValuePiece, ValuePiece];

interface CustomCalendarProps {
	value?: DateValue;
	onChange?: (date: DateValue) => void;
}

const CustomCalendar = ({ value = new Date(), onChange }: CustomCalendarProps) => {
	const [date, setDate] = useState<DateValue>(value);

	const handleOnChange = (val: DateValue) => {
		setDate(val);
		onChange?.(val);
	};

	return <StyledCalendar defaultValue={date} onChange={handleOnChange} value={date} showNeighboringMonth={false} />;
};

export default CustomCalendar;
