import { Box, SxProps } from "@mui/material";
import { DropDownOptionProps } from "../../Utils/types";
import CustomButton from "./CustomButton";
import { useTranslation } from "react-i18next";

interface CustomSingleSelectProps {
  options?: Array<DropDownOptionProps>;
  value?: string | number;
  onChange?: (value: string) => void;

  sx?: SxProps;
  className?: string;
}

const CustomSingleSelect = ({
  value,
  onChange,
  options,
  sx,
  className,
}: CustomSingleSelectProps) => {
  const { t } = useTranslation();

  const handleOnChange = (val: string | number) => {
    onChange?.(val?.toString() || "");
  };

  return (
    <Box
      className={className}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${250}px, 1fr))`,
        alignItems: "center",
        gap: 10,
        ...sx,

        "& button": {
          // padding: "18px 6px",
        },
      }}
    >
      {options?.map((option: DropDownOptionProps) => (
        <CustomButton
          key={option.value}
          variant={option.value === value ? "contained" : "outlined"}
          onClick={() => handleOnChange(option.value)}
        >
          {t(option.text)}
        </CustomButton>
      ))}
    </Box>
  );
};
// TODO: move the FE to NextJs, same files same logics for now, later can shift the logic to Next15 as well

export default CustomSingleSelect;
