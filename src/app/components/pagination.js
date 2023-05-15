import React from "react";
import Pagination from "@mui/material/Pagination";

function PaginationIndex({ page, setPage, total, limit }) {
  return (
    <div>
      <Pagination
        color="secondary"
        count={Math.ceil(total / limit)}
        page={page}
        onChange={(event, newpage) => setPage(newpage)}
      />
    </div>
  );
}

export default PaginationIndex;
