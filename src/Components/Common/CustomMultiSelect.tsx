import { Box, SxProps } from "@mui/material";
import { DropDownOptionProps } from "../../Utils/types";
import CustomButton from "./CustomButton";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";

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
  const { t, i18n } = useTranslation();
  const isEnglishSelected = i18n.language === languages.ENGLISH;

  const isAllSelected = options?.every((option: DropDownOptionProps) =>
    value?.includes(option.value.toString())
  );

  const isSelected = (val: string | number) => {
    return value?.includes(val.toString());
  };

  const handleOnChange = (val: string | number) => {
    if (value?.includes(val.toString())) {
      onChange?.(value.filter((item: string) => item !== val.toString()));
    } else {
      onChange?.([...(value || []), val.toString()]);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange?.([]);
    } else {
      onChange?.(
        options?.map((option: DropDownOptionProps) =>
          option.value?.toString()
        ) || []
      );
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          isLargeButtons ? 250 : isEnglishSelected ? 120 : 170
        }px, 1fr))`,
        alignItems: "center",
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
      <Box sx={{ gridColumn: "1 / -1" }}></Box>
      <CustomButton
        variant={isAllSelected ? "contained" : "outlined"}
        onClick={handleSelectAll}
      >
        {t(isAllSelected ? "Unselect All" : "Select All")}
      </CustomButton>
    </Box>
  );
};
// TODO: move the FE to NextJs, same files same logics for now, later can shift the logic to Next15 as well

export default CustomMultiSelect;
