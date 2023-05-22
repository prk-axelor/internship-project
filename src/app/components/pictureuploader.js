import { Button, Grid } from "@mui/material";
import React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const Pictureuploader = ({ setPicture, picture, handleUpload }) => {
  const frontUrl = "ws/rest/com.axelor.meta.db.MetaFile";
  const backUrl = "content/download";
  const handleDelete = () => {
    setPicture(null);
  };
  return (
    <>
      <Grid item sm={6} height={150}>
        <Button variant="contained" component="label" sx={{ mr: 1 }}>
          <FileUploadIcon />
          Upload File
          <input type="file" hidden name="picture" onChange={handleUpload} />
        </Button>
        {picture && (
          <Button
            onClick={handleDelete}
            variant="contained"
            component="label"
            sx={{ mr: 1 }}
          >
            <CancelPresentationIcon />
          </Button>
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {picture && (
          <img
            src={`${frontUrl}/${picture.id}/${backUrl}`}
            alt="author"
            width={100}
            height={100}
          />
        )}
      </Grid>
    </>
  );
};

export default Pictureuploader;
