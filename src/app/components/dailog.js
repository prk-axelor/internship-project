import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

const Dailogbox = ({ openBox, closeBox, onDelete }) => {
  return (
    <div>
      <Dialog
        open={openBox}
        onClose={closeBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Question</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete the selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBox} variant="outlined" color="success">
            cancel
          </Button>
          <Button
            onClick={onDelete}
            autoFocus
            variant="outlined"
            color="success"
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dailogbox;
