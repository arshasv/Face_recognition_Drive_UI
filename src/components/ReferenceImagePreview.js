import { Paper, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ReferenceImagePreview = ({ imageUrl, onRemove }) => (
  <Paper
    sx={{
      width: 80,
      height: 80,
      overflow: "hidden",
      margin: "auto",
      mb: 2,
      position: "relative",
    }}
  >
    <img
      src={imageUrl}
      alt="reference"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Button
      size="small"
      sx={{
        minWidth: 0,
        padding: 0,
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
      }}
      onClick={onRemove}
    >
      <CloseIcon fontSize="small" />
    </Button>
  </Paper>
);

export default ReferenceImagePreview;
