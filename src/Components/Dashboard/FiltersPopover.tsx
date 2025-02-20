import { Close, FilterListOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import CustomDateRangePicker from "../Common/CustomDateRangePicker";

type TimeFilterType = "Day" | "Week" | "Month" | "Year" | "";

type DisplayUnitType = "kW" | "$" | "Accounts" | "";

export interface FunnelFiltersState {
  timeFilter: TimeFilterType;
  minDate?: string;
  maxDate?: string;
  unit: DisplayUnitType;
}

interface FiltersPopoverProps {
  filters: FunnelFiltersState;
  updateFilters?: (updateFilters: FunnelFiltersState) => void;
}

export const timeFilters = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year",
};
export const funnelUnits = {
  DOLLAR: "$",
  KILO_WATT: "kW",
  ACCOUNTS: "Accounts",
  CONVERSION_RATE: "Conversion",
};

const FiltersPopover: React.FC<FiltersPopoverProps> = ({
  filters,
  updateFilters,
}) => {
  const colors = useSelector(selectColors);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFilters, setSelectedFilters] =
    React.useState<FunnelFiltersState>({
      timeFilter: "",
      minDate: "",
      maxDate: "",
      unit: "",
    });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (open) {
      const currentFilters = {
        timeFilter: filters.timeFilter,
        minDate: filters.minDate,
        maxDate: filters.maxDate,
        unit: filters.unit,
      };
      setSelectedFilters(currentFilters);
    }
  }, [open]);

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    updateFilters?.(selectedFilters);
    handleClose();
  };

  const handleTimeFilter = (value: TimeFilterType) => {
    const newTimeFilter = value === selectedFilters.timeFilter ? "" : value;
    setSelectedFilters({
      ...selectedFilters,
      timeFilter: newTimeFilter,
      minDate: "",
      maxDate: "",
    });
  };

  const handleCustomRange = (min: string, max: string) => {
    setSelectedFilters({
      ...selectedFilters,
      minDate: min,
      maxDate: max,
      timeFilter: "",
    });
  };

  const handleDisplayUnit = (value: DisplayUnitType) => {
    const newTimeFilter = value === selectedFilters.unit ? "" : value;
    setSelectedFilters({ ...selectedFilters, unit: newTimeFilter });
  };

  const handleReset = () => {
    setSelectedFilters({
      timeFilter: "",
      minDate: "",
      maxDate: "",
      unit: "",
    });
  };

  const filtersApplied =
    (filters.unit ? 1 : 0) +
    (filters.minDate || filters.maxDate || filters.timeFilter ? 1 : 0);

  return (
    <>
      <Button
        sx={{ padding: "8px 20px" }}
        variant='text'
        onClick={handleOpen}
        startIcon={<FilterListOutlined />}
        endIcon={
          filtersApplied ? (
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "100%",
                bgcolor: colors.primary,
                color: "white",
                fontSize: "14px !important",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filtersApplied}
            </Box>
          ) : undefined
        }
      >
        Filters
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          style: {
            borderRadius: borderRadius.md,
            boxShadow: "0px 2px 32px 2px #0000001A",
            // WebkitBackdropFilter: "saturate(180%) blur(20px)",
            // backdropFilter: "saturate(180%) blur(20px)",
            // backgroundColor: "rgba(255, 255, 255, 0.85)",
          },
        }}
      >
        <Box sx={{ p: 24, minWidth: 200, position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              bgColor: "white",
              zIndex: 1000,
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>

          <Typography variant='h4'>Filters</Typography>
          <Typography mt={4} color='text.secondary'>
            Select filters that you want to apply on funnel diagram
          </Typography>

          <Divider sx={{ my: 20 }} />

          <Typography variant='h6' mb={8}>
            Filter by:
          </Typography>

          <Box display='grid' gridTemplateColumns={"1fr 1fr 1fr 1fr"} gap={8}>
            {(Object.values(timeFilters) as Array<TimeFilterType>).map(
              (timeFilter: TimeFilterType) => (
                <Button
                  size='small'
                  key={timeFilter}
                  variant={
                    selectedFilters.timeFilter === timeFilter
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleTimeFilter(timeFilter)}
                  sx={{ border: `1px solid ${colors.primary}` }}
                >
                  {timeFilter}
                </Button>
              )
            )}
          </Box>

          <Box display='grid' gridTemplateColumns={"1fr"} mt={8}>
            <CustomDateRangePicker
              onUpdate={handleCustomRange}
              minDate={selectedFilters.minDate}
              maxDate={selectedFilters.maxDate}
            />
          </Box>

          <Typography variant='h6' mt={16} mb={8}>
            Measurement Unit:
          </Typography>
          <Box display='grid' gridTemplateColumns={"1fr 1fr"} gap={8}>
            {(Object.values(funnelUnits) as Array<DisplayUnitType>).map(
              (unit: DisplayUnitType) => (
                <Button
                  size='small'
                  key={unit}
                  variant={
                    selectedFilters.unit === unit ? "contained" : "outlined"
                  }
                  onClick={() => handleDisplayUnit(unit)}
                >
                  {unit === funnelUnits.ACCOUNTS
                    ? "No. of Accounts"
                    : unit === funnelUnits.CONVERSION_RATE
                    ? "Conversion Rate"
                    : unit}
                </Button>
              )
            )}
          </Box>

          <Divider sx={{ my: 20 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button
              size='small'
              onClick={handleReset}
              sx={{ mr: "auto", p: "2px !important" }}
            >
              Reset
            </Button>
            <Button size='small' variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
            <Button size='small' variant='contained' onClick={handleApply}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FiltersPopover;
