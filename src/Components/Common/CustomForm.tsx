import { Box, Divider, FormHelperText, Typography } from "@mui/material";
import ImageUploader from "./ImageUploader"; // Adjust path accordingly
import CustomTextField, { Asterisk } from "./CustomTextField";
import CustomButton from "./CustomButton";
import React, { FormEvent } from "react";
import AnimatedHeading from "./AnimatedHeading";
import CustomDropdown from "./CustomDropdown";
import { DropDownOptionProps } from "../../Utils/types";
import { useTranslation } from "react-i18next";
import CustomMultiSelect from "./CustomMultiSelect";

export interface FormField {
  label: string;
  name: string;
  required?: boolean;
  type?:
    | "text"
    | "email"
    | "password"
    | "phone"
    | "image"
    | "dropdown"
    | "multiselect";
  multiline?: boolean;
  error?: string;
  placeholder?: string;
  options?: Array<DropDownOptionProps>;
  disabled?: boolean;
  isSquarish?: boolean;
}

// Type for non-multiselect fields
interface FormFieldWithSingleValue extends FormField {
  type?: Exclude<FormField["type"], "multiselect">;
  value: string | number | undefined;
  onChange: ({ name, value }: { name: string; value: string | number }) => void;
}

// Type for multiselect field
interface FormFieldWithMultiSelect extends FormField {
  type: "multiselect";
  value: string[];
  isLargeButtons?: boolean;
  onChange: ({ name, value }: { name: string; value: string[] }) => void;
}

// Discriminated union
export type FormFieldWithValue =
  | FormFieldWithSingleValue
  | FormFieldWithMultiSelect;

interface FormProps {
  heading?: string;
  subHeading?: string;
  fields: FormFieldWithValue[];
  onSave: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
}

const CustomForm = ({
  heading,
  subHeading,
  fields,
  onSave,
  onCancel,
  saveButtonText = "Save Changes",
  cancelButtonText = "Cancel",
}: FormProps) => {
  const { t } = useTranslation();

  return (
    <>
      {!!heading && <AnimatedHeading heading={t(heading)} variant='h3' />}
      {!!subHeading && (
        <Typography
          variant='body2'
          className='animated-block'
          sx={{ animationDelay: `${1 / 21}s`, mt: heading ? 10 : 0 }}
        >
          {t(subHeading)}
        </Typography>
      )}
      {(heading || subHeading) && (
        <Divider
          className='animated-block'
          sx={{ animationDelay: `${2 / 21}s`, mt: 14, mb: 24 }}
        />
      )}

      <form onSubmit={onSave}>
        <Box
          display='grid'
          gridTemplateColumns={{ xs: "1fr", md: "300px 1fr" }}
          gap={{ xs: 10, md: 32 }}
        >
          {fields.map((field, idx) => {
            const delay = `${(idx + 3) / 21}s`;
            return (
              <React.Fragment key={field.name}>
                {field.type === "image" || field.type === "multiselect" ? (
                  <Box
                    className='animated-block'
                    alignSelf='flex-start'
                    sx={{ animationDelay: delay }}
                  >
                    <Typography variant='h5'>
                      {t(field.label)} {!!field.required && <Asterisk />}
                    </Typography>
                    <Typography variant='body2' mt={10}>
                      {!!field.placeholder && t(field.placeholder)}
                    </Typography>
                    {!!field.error && (
                      <FormHelperText sx={{ color: "error.main", mt: 10 }}>
                        {t(field.error)}
                      </FormHelperText>
                    )}
                  </Box>
                ) : (
                  <Typography
                    className='animated-block'
                    variant='h5'
                    mt={{ xs: 12, md: 0 }}
                    sx={{ animationDelay: delay }}
                  >
                    {t(field.label)}
                    {!!field.required && <Asterisk />}
                  </Typography>
                )}
                {field.type === "image" ? (
                  <ImageUploader
                    className='animated-block'
                    sx={{ animationDelay: delay }}
                    onUpdate={(image: any) =>
                      field.onChange({ value: image, name: field.name })
                    }
                    imageFile={field.value}
                    isSquarish={field.isSquarish}
                  />
                ) : field.type === "dropdown" ? (
                  <CustomDropdown
                    className='animated-block'
                    name={field.name}
                    options={field.options || []}
                    value={field.value}
                    onChange={(value: string) =>
                      field.onChange({ value, name: field.name })
                    }
                    minWidth='100%'
                    error={field.error}
                    label={field.placeholder || field.label}
                    disabled={field.options?.length === 0 || field.disabled}
                    sx={{ animationDelay: delay }}
                  />
                ) : field.type === "multiselect" ? (
                  <CustomMultiSelect
                    className='animated-block'
                    sx={{ animationDelay: delay }}
                    options={field.options || []}
                    value={field.value}
                    isLargeButtons={field.isLargeButtons}
                    onChange={(value: string[]) =>
                      field.onChange({ value, name: field.name })
                    }
                  />
                ) : (
                  <CustomTextField
                    style={{ animationDelay: delay }}
                    className='animated-block'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange({
                        value: e.target.value,
                        name: field.name,
                      })
                    }
                    value={field.value}
                    error={field.error}
                    name={field.name}
                    type={field.type === "phone" ? "tel" : field.type}
                    placeholder={field.placeholder || field.label}
                    multiline={field.multiline}
                    displayPasswordIcon={field.type === "password"}
                  />
                )}
              </React.Fragment>
            );
          })}

          <Box />
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
            gap={20}
          >
            <CustomButton
              variant='outlined'
              color='secondary'
              onClick={onCancel}
              className='animated-block'
              sx={{ animationDelay: `${(fields?.length + 3) / 21}s` }}
            >
              {t(cancelButtonText)}
            </CustomButton>
            <CustomButton
              type='submit'
              className='animated-block'
              sx={{ animationDelay: `${(fields?.length + 4) / 21}s` }}
            >
              {t(saveButtonText)}
            </CustomButton>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default CustomForm;
