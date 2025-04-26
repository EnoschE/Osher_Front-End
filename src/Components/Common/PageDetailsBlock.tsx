import { Box, Divider, Skeleton, Typography } from "@mui/material";
import * as React from "react";
import { PageDetailsField } from "../../Utils/types";
import moment from "moment";
import { borderRadius } from "../../Utils/spacings";

interface PageDetailsProps {
  data: any;
  fields: Array<PageDetailsField>;
  showBottomDivider?: boolean;
  isLoading?: boolean;
  animationDelay?: number;
}

const PageDetailsBlock = ({
  data,
  fields,
  showBottomDivider,
  isLoading,
  animationDelay = 6 / 21,
}: PageDetailsProps) => {
  return (
    <>
      <Box
        className='animated-block'
        display='grid'
        gridTemplateColumns={{ xs: "1fr", md: "300px 1fr" }}
        gap={{ xs: 16, md: 20 }}
        alignItems='center'
        mt={45}
        sx={{ animationDelay: `${animationDelay}s` }}
      >
        {fields?.map((field: PageDetailsField) => (
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
                <Typography variant='h6'>{field.text}</Typography>
                <Typography
                  component={field.customComponent ? "span" : "p"}
                  whiteSpace={
                    field.text === "Description" ? "pre-wrap" : "normal"
                  }
                >
                  {field?.customComponent
                    ? field?.customComponent
                    : field.type === "date"
                    ? moment(data?.[field.key]).format("LL")
                    : data?.[field.key] || "Not given"}
                </Typography>
              </>
            )}
          </React.Fragment>
        ))}
      </Box>

      {showBottomDivider && <Divider sx={{ my: { xs: 16, md: 42 } }} />}
    </>
  );
};

export default PageDetailsBlock;
