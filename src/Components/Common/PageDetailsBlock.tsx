import { Box, Divider, Typography } from "@mui/material";
import * as React from "react";
import { PageDetailsField } from "../../Utils/types";
import moment from "moment";

interface PageDetailsProps {
  data: any;
  fields: Array<PageDetailsField>;
  showBottomDivider?: boolean;
}

const PageDetailsBlock = ({
  data,
  fields,
  showBottomDivider,
}: PageDetailsProps) => {
  return (
    <>
      <Box
        display='grid'
        gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
        gap={{ xs: 10, md: 32 }}
        alignItems='center'
        mt={45}
      >
        {fields?.map((field: PageDetailsField) => (
          <React.Fragment key={field.key}>
            <Typography variant='h6'>{field.text}</Typography>
            <Typography>
              {field?.customComponent || field.type === "date"
                ? moment(data?.[field.key]).format("LL")
                : data?.[field.key] || "Not given"}
            </Typography>
          </React.Fragment>
        ))}
      </Box>

      {showBottomDivider && <Divider sx={{ my: { xs: 16, md: 42 } }} />}
    </>
  );
};

export default PageDetailsBlock;
