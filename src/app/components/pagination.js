import React from "react";
import Pagination from "@mui/material/Pagination";
import { Grid } from "@mui/material";

function PaginationIndex({ page, setPage, total, limit }) {
  return (
    <>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={4} align="center">
          Total Items: {total}
        </Grid>
        <Grid item xs={12} sm={4} >
          <Pagination
            size="large"
            color="secondary"
            count={Math.ceil(total / limit)}
            page={page}

            align="center"
            onChange={(event, newpage) => setPage(newpage)}
          />
        </Grid>
        <Grid item xs={12} sm={4} align="center">
          Page: {page}
        </Grid>
      </Grid>





    </>
  );
}

export default PaginationIndex;
