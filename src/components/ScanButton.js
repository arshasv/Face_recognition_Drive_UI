import React from "react";
import { Button } from "@mui/material";

const ScanButton = ({ onScan }) => {
  return (
    <Button variant="contained" color="primary" onClick={onScan}>
      Scan
    </Button>
  );
};

export default ScanButton;