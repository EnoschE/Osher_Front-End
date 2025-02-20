import { Box, Divider, Typography } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import ImageUploader from "./ImageUploader"; // Adjust path accordingly
import CustomTextField, { Asterisk } from "./CustomTextField";
import CustomButton from "./CustomButton";
import React, { FormEvent } from "react";

export interface FormField {
  label: string;
  name: string;
  required?: boolean;
  type: "text" | "email" | "password" | "phone" | "image";
  value: string | number | undefined;
  onChange: (event: any) => void;
  error?: string;
  placeholder?: string;
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
      {!!heading && (
        <Typography variant='h5' mb={10}>
          {heading}
        </Typography>
      )}
      {!!subHeading && <Typography fontSize={15}>{subHeading}</Typography>}
      {(heading || subHeading) && <Divider sx={{ mt: 14, mb: 24 }} />}

      <form onSubmit={onSave}>
        <Box
          display='grid'
          gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
          gap={{ xs: 10, md: 32 }}
        >
          {fields.map((field) => (
            <React.Fragment key={field.name}>
              {field.type === "image" ? (
                <Box alignSelf='flex-start'>
                  <Typography variant='h5'>{field.label}</Typography>
                  <Typography fontSize={15} mt={10}>
                    {field.placeholder}
                  </Typography>
                </Box>
              ) : (
                <Typography variant='h6' fontSize={18} mt={{ xs: 12, md: 0 }}>
                  {field.label}
                  {!!field.required && <Asterisk />}
                </Typography>
              )}
              {field.type === "image" ? (
                <ImageUploader
                  onUpdate={field.onChange}
                  imageFile={field.value}
                />
              ) : field.type === "phone" ? (
                <MuiPhoneNumber
                  defaultCountry={"us"}
                  autoComplete='off'
                  onChange={(phoneNumber: any) =>
                    field.onChange(phoneNumber?.toString() || "")
                  }
                  fullWidth
                  variant='outlined'
                  size='small'
                  value={field.value}
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <CustomTextField
                  onChange={field.onChange}
                  value={field.value}
                  error={field.error}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              )}
            </React.Fragment>
          ))}

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
            >
              {cancelButtonText}
            </CustomButton>
            <CustomButton type='submit'>{saveButtonText}</CustomButton>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default CustomForm;
