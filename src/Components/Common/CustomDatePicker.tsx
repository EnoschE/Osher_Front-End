import { useState, forwardRef, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Box, InputAdornment, SxProps, TextField } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarMonthOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import colors from "../../Utils/colors";
import { borderRadius } from "../../Utils/spacings";

const CustomDatePicker = ({
  error,
  className,
  disabled,
  value,
  onChange,
  label = "Select Date",
  sx,
}: {
  error?: string;
  className?: string;
  disabled?: boolean;
  value?: string | number;
  onChange: (val: string) => void;
  label?: string;
  sx?: SxProps;
}) => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value?.toString()) : null
  );

  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
      return;
    }

    const raw = value.toString();

    const isoDate = new Date(raw);
    if (!isNaN(isoDate.getTime())) {
      setSelectedDate(isoDate);
    } else {
      const fallbackDate = moment(raw, "MM-DD-YYYY", true); // strict mode
      if (fallbackDate.isValid()) {
        setSelectedDate(fallbackDate.toDate());
      } else {
        setSelectedDate(null);
      }
    }
  }, [value]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) onChange(date.toISOString().split("T")[0]);
    else onChange("");
  };

  // MUI TextField wrapper for react-datepicker input
  const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick }, ref) => (
      <TextField
        fullWidth
        placeholder={t(label)}
        value={value}
        onClick={onClick}
        inputRef={ref}
        variant='outlined'
        disabled={disabled}
        helperText={t(error || "")}
        error={!!error}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <CalendarMonthOutlined sx={{ width: "18px", height: "18px" }} />
            </InputAdornment>
          ),
        }}
      />
    )
  );

  return (
    <Box
      className={className}
      sx={{
        ...sx,
        zIndex: 2,
        "& .react-datepicker-wrapper": { width: "100%" },

        "& .custom-datepicker-calendar": {
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          boxShadow: `rgba(23, 58, 90, 0.25) 0px 50px 50px -10px`,
        },

        "& .react-datepicker__header": {
          backgroundColor: "primary.main",
          borderTopLeftRadius: borderRadius.lg,

          "&:not(.react-datepicker__header--has-time-select)": {
            borderTopRightRadius: `${borderRadius.lg}px !important`,
          },
        },

        "& .react-datepicker__day--selected": {
          backgroundColor: "primary.main",
        },

        "& .react-datepicker__current-month": {
          marginBottom: 12,
        },

        "& .react-datepicker__navigation-icon::before, .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow":
          { borderColor: "#000" },

        "& .react-datepicker__triangle": { display: "none" },
      }}
    >
      <DatePicker
        disabled={disabled}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat='MM-dd-yyyy'
        placeholderText='Select Date'
        customInput={<CustomInput />}
        popperPlacement='bottom-start' // e.g., position popper
        popperClassName='custom-datepicker-popper'
        calendarClassName='custom-datepicker-calendar'
      />
    </Box>
  );
};

export default CustomDatePicker;
