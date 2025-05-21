import { Box, Chip, Divider, Skeleton, Typography } from "@mui/material";
import * as React from "react";
import { PageDetailsField } from "../../Utils/types";
import moment from "moment";
import { borderRadius } from "../../Utils/spacings";
import { useTranslation } from "react-i18next";

interface PageDetailsProps {
  data: any;
  fields: Array<PageDetailsField>;
  showBottomDivider?: boolean;
  isLoading?: boolean;
  animationDelay?: number;
}

export const commonDetailsPageFields = [
  { text: "Name", key: "name" },
  { text: "Email", key: "email" },
  { text: "Address", key: "address" },
  { text: "Phone Number", key: "phone" },
];

const PageDetailsBlock = ({
  data,
  fields,
  showBottomDivider,
  isLoading,
  animationDelay = 6 / 21,
}: PageDetailsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Box
        className='animated-block'
        display='grid'
        gridTemplateColumns={{ xs: "1fr", md: "300px 1fr" }}
        gap={{ xs: 8, md: 20 }}
        alignItems='center'
        mt={45}
        sx={{ animationDelay: `${animationDelay}s` }}
      >
        {fields?.map((field: PageDetailsField) => {
          const isArray = Array.isArray(data?.[field.key]);

          // TODO: Ad option to display 0 as 0
          // TODO: Fix navbar issue for android that Enosch sent last night
          // TODO: next work on Video Ads
          // TODO: and then next work on Full screen video ads for Games

          const renderValue = field?.customComponent
            ? field?.customComponent(data)
            : field.type === "date"
            ? moment(data?.[field.key]).format("LL")
            : isArray
            ? data?.[field.key]?.length
              ? data?.[field.key]?.map((item: string) => (
                  <Chip
                    key={item}
                    size='small'
                    component='span'
                    label={item}
                    sx={{ mr: 4, mb: 6 }}
                  />
                ))
              : "Not given"
            : data?.[field.key] || "Not given";

          return (
            <React.Fragment key={field.key}>
              {isLoading ? (
                <>
                  <Skeleton
                    variant='text'
                    width='100%'
                    height={20}
                    sx={{ borderRadius: borderRadius.sm }}
                  />
                  <Skeleton
                    variant='text'
                    width='100%'
                    height={20}
                    sx={{ borderRadius: borderRadius.sm, maxWidth: 450 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant='h6' mt={{ xs: 12, md: 0 }}>
                    {t(field.text)}
                  </Typography>
                  <Typography
                    component={
                      isArray ? "div" : field.customComponent ? "span" : "p"
                    }
                    whiteSpace={
                      field.text === "Description" ? "pre-wrap" : "normal"
                    }
                    fontSize={14}
                  >
                    {renderValue}
                  </Typography>
                </>
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {showBottomDivider && <Divider sx={{ my: { xs: 16, md: 42 } }} />}
    </>
  );
};

export default PageDetailsBlock;
