import { Box, Divider, FormHelperText, Typography } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import ImageUploader from "./ImageUploader"; // Adjust path accordingly
import CustomTextField, { Asterisk } from "./CustomTextField";
import CustomButton from "./CustomButton";
import React, { FormEvent } from "react";
import AnimatedHeading from "./AnimatedHeading";
import CustomDropdown from "./CustomDropdown";
import { DropDownOptionProps } from "../../Utils/types";

export interface FormField {
  label: string;
  name: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "phone" | "image" | "dropdown";
  multiline?: boolean;
  value: string | number | undefined;
  onChange: ({ name, value }: { name: string; value: any }) => void;
  error?: string;
  placeholder?: string;
  options?: Array<DropDownOptionProps>;
  disabled?: boolean;
}

interface FormProps {
  heading?: string;
  subHeading?: string;
  fields: FormField[];
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
  return (
    <>
      {!!heading && <AnimatedHeading heading={heading} variant='h3' />}
      {!!subHeading && (
        // <AnimatedBlock animationDelay={0.3} sx={{ mt: heading ? 10 : 0 }}>
        <Typography
          variant='body2'
          className='animated-block'
          sx={{ animationDelay: `${1 / 21}s`, mt: heading ? 10 : 0 }}
        >
          {subHeading}
        </Typography>
        // </AnimatedBlock>
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
                {field.type === "image" ? (
                  <Box
                    className='animated-block'
                    alignSelf='flex-start'
                    sx={{ animationDelay: delay }}
                  >
                    <Typography variant='h5'>
                      {field.label} {!!field.required && <Asterisk />}
                    </Typography>
                    <Typography variant='body2' mt={10}>
                      {field.placeholder}
                    </Typography>
                    {!!field.error && (
                      <FormHelperText sx={{ color: "error.main", mt: 10 }}>
                        {field.error}
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
                    {field.label}
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
                    label={field.placeholder}
                    disabled={field.options?.length === 0 || field.disabled}
                    sx={{ animationDelay: delay }}
                  />
                ) : field.type === "phone" ? (
                  <MuiPhoneNumber
                    className='animated-block'
                    defaultCountry={"us"}
                    autoComplete='off'
                    onChange={(phoneNumber: any) =>
                      field.onChange({
                        value: phoneNumber?.toString() || "",
                        name: field.name,
                      })
                    }
                    fullWidth
                    variant='outlined'
                    size='small'
                    value={field.value}
                    InputLabelProps={{ shrink: true }}
                    error={!!field.error}
                    helperText={field.error}
                    sx={{ animationDelay: delay }}
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
                    type={field.type}
                    placeholder={field.placeholder}
                    multiline={field.multiline}
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
              {cancelButtonText}
            </CustomButton>
            <CustomButton
              type='submit'
              className='animated-block'
              sx={{ animationDelay: `${(fields?.length + 4) / 21}s` }}
            >
              {saveButtonText}
            </CustomButton>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default CustomForm;
