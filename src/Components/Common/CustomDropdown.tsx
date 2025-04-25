import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ExpandMoreRounded } from "@mui/icons-material";
import { FormHelperText, SxProps, Typography } from "@mui/material";
import { DropDownOptionProps } from "../../Utils/types";
import CustomAvatar from "./CustomAvatar";

interface CustomDropdownProps {
  name?: string;
  label?: string;
  options?: Array<DropDownOptionProps>;
  value?: string | number;
  disabled?: boolean;
  minWidth?: string | number;
  onChange?: (value: string) => void;
  isLargeDropdown?: boolean;
  error?: string;
  defaultSelectable?: boolean;
  sx?: SxProps;
  className?: string;
}

const CustomDropdown = ({
  value,
  onChange,
  disabled,
  name,
  label,
  options,
  minWidth = 160,
  isLargeDropdown,
  error,
  defaultSelectable,
  sx,
  className,
}: CustomDropdownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange?.(event.target.value);
  };

  return (
    <FormControl
      className={className}
      sx={{
        ...sx,
        m: 1,
        minWidth: isLargeDropdown ? { xs: "100%", md: 560 } : minWidth,
      }}
      error={!!error}
      disabled={disabled}
    >
      <Select
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        inputProps={{ "aria-label": "Custom Dropdown" }}
        IconComponent={ExpandMoreRounded}
        renderValue={(selected) => {
          if (selected === "")
            return (
              <Typography color="text.disabled" minHeight={20}>
                {label}
              </Typography>
            );

          const selectedOption = options?.find(
            (option) => option.value === selected,
          );

          return (
            <Typography display="flex" alignItems="center" minHeight={20}>
              {!!selectedOption?.picture && (
                <CustomAvatar
                  size="xs"
                  src={selectedOption.picture}
                  sx={{ mr: 10 }}
                />
              )}

              {selectedOption?.text}
            </Typography>
          );
        }}
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
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {!!option.picture && (
              <CustomAvatar size="xs" src={option.picture} sx={{ mr: 10 }} />
            )}
            {option.text}
          </MenuItem>
        ))}
      </Select>
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export default CustomDropdown;
