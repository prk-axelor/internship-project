import { Button } from "@mui/material";
import React from "react";

const Buttons = ({ onClick, saving, children }) => {
  return (
    <Button
      type="submit"
      sx={{ mr: 1 }}
      onClick={onClick}
      disabled={saving}
      variant="outlined"
      color="secondary"
    >
      {children}
    </Button>
  );
};

export default Buttons;
