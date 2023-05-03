import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LIMIT = 10;
function Page() {
  const [total, setTotal] = useState(0);

  const [searchparams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchparams.get("page") || 1));
  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);
  return (
    
  );
}

export default Page;
