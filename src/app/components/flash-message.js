import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useState } from "react";

const FlashMessage = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
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
