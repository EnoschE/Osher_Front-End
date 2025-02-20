import { Button, Popover, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface CustomDateRangePickerProps {
	minDate?: string;
	maxDate?: string;
	onUpdate: (min?: any, max?: any) => void;
}

export const formatDatesForDisplay = (min: string, max: string) => {
	return `${moment(min, 'MM-DD-YYYY"').format("ll")} to ${moment(max, 'MM-DD-YYYY"').format("ll")}`;
};

const CustomDateRangePicker = ({ minDate, maxDate, onUpdate }: CustomDateRangePickerProps) => {
	const colors = useSelector(selectColors);

	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedDates, setSelectedDates] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
			color: colors.primary,
		},
	]);

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	useEffect(() => {
		if (open) {
			setSelectedDates([
				{
					startDate: minDate ? new Date(moment(minDate, "MM-DD-YYYY").format("ll")) : new Date(),
					endDate: maxDate ? new Date(moment(maxDate, "MM-DD-YYYY").format("ll")) : new Date(),
					key: "selection",
					color: colors.primary,
				},
			]);
		}
	}, [open]);

	const handleOpenDatePicker = (event: any) => setAnchorEl(event.currentTarget);
	const handleCloseDatePicker = () => setAnchorEl(null);

	const handleSelectDateRange = (ranges: any) => {
		const currentDate = new Date();
		const startDate = ranges.selection.startDate;
		const endDate = ranges.selection.endDate;
		startDate.setHours(currentDate.getHours());
		startDate.setMinutes(currentDate.getMinutes());
		startDate.setSeconds(currentDate.getSeconds());
		endDate.setHours(currentDate.getHours());
		endDate.setMinutes(currentDate.getMinutes());
		endDate.setSeconds(currentDate.getSeconds());
		ranges.selection.startDate = startDate;
		ranges.selection.endDate = endDate;
		setSelectedDates([ranges.selection]);
	};

	const handleApplyDateRange = () => {
		const updatedDates = selectedDates[0];

		const updatedMinDate = moment(updatedDates.startDate).format("MM-DD-YYYY");
		const updatedMaxDate = moment(updatedDates.endDate).format("MM-DD-YYYY");

		onUpdate?.(updatedMinDate, updatedMaxDate);
		handleCloseDatePicker();
	};

	return (
		<>
			<Button
				size="small"
				variant={minDate && maxDate ? "contained" : "outlined"}
				aria-describedby={id}
				onClick={handleOpenDatePicker}
			>
				{minDate && maxDate ? formatDatesForDisplay(minDate, maxDate) : "Custom Date Range"}
			</Button>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleCloseDatePicker}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				PaperProps={{
					style: {
						borderRadius: borderRadius.md,
						boxShadow: "0px 2px 32px 2px #0000001A",
					},
				}}
				sx={{
					"& .rdrDefinedRangesWrapper": { display: "none" },
					"& .rdrDayNumber": {
						"& span::after": {
							background: colors.primary,
						},
					},
				}}
			>
				<DateRangePicker
					ranges={selectedDates}
					onChange={handleSelectDateRange}
					moveRangeOnFirstSelection={false}
					color={colors.primary}
					showMonthAndYearPickers={false}
					showDateDisplay={false}
					staticRanges={[]}
				/>
				<Box display="flex" alignItems="center" justifyContent="flex-end" gap="12px" pr="16px" pb="20px">
					<Button size="small" onClick={handleCloseDatePicker} variant="outlined">
						Cancel
					</Button>
					<Button size="small" onClick={handleApplyDateRange} variant="contained">
						Select Range
					</Button>
				</Box>
			</Popover>
		</>
	);
};

export default CustomDateRangePicker;
