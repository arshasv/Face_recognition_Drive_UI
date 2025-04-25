import React from "react";
import { Button } from "@mui/material";

const FileUpload = ({ onUpload }) => {
  return (
    <Button variant="contained" component="label">
      Upload Folder
      <input type="file" webkitdirectory="" directory="" hidden onChange={onUpload} />
    </Button>
  );
};

export default FileUpload;