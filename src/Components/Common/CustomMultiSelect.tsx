import { Box, SxProps } from "@mui/material";
import { DropDownOptionProps } from "../../Utils/types";
import CustomButton from "./CustomButton";

interface CustomMultiSelectProps {
  options?: Array<DropDownOptionProps>;
  value?: string[];
  onChange?: (value: string[]) => void;
  isLargeButtons?: boolean;
  sx?: SxProps;
  className?: string;
}

const CustomMultiSelect = ({
  isLargeButtons,
  value,
  onChange,
  options,
  sx,
  className,
}: CustomMultiSelectProps) => {
  const array = value || [];

  const isSelected = (val: string | number) => {
    return array?.includes(val.toString());
  };

  const handleOnChange = (val: string | number) => {
    if (array?.includes(val.toString())) {
      onChange?.(array.filter((item: string) => item !== val.toString()));
    } else {
      onChange?.([...(array || []), val.toString()]);
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          isLargeButtons ? 250 : 100
        }px, 1fr))`,
        gap: 10,

        ...sx,

        "& button": {
          padding: "8px 6px",
        },
      }}
    >
      {options?.map((option: DropDownOptionProps) => (
        <CustomButton
          key={option.value}
          variant={isSelected(option.value) ? "contained" : "outlined"}
          onClick={() => handleOnChange(option.value)}
        >
          {option.text}
        </CustomButton>
      ))}
    </Box>
  );
};
// TODO: move the FE to NextJs, same files same logics for now, later can shift the logic to Next15 as well

export default CustomMultiSelect;
