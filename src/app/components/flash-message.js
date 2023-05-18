import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlashMessage = ({ path }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(`/${path}`);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Record Updated!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FlashMessage;
