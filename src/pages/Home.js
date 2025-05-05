import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";

const Home = () => {
  const [driveLink, setDriveLink] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [matchedImages, setMatchedImages] = useState([]);
  const [referenceImageURL, setReferenceImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const extractFolderId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const handleFetchImages = async () => {
    const folderId = extractFolderId(driveLink);
    if (!folderId) {
      alert("Invalid Google Drive link");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/fetch-images?folder_id=${folderId}`);
      const data = await response.json();
      if (response.ok && data?.images) {
        setAllImages(data.images);
        setMatchedImages([]);
      } else {
        alert("No images found.");
      }
    } catch (error) {
      alert("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const handleReferenceImageUpload = async (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const response = await fetch("http://localhost:8000/upload-reference-image", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        alert("Failed to upload reference image.");
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.url) {
          setReferenceImageURL(data.url);
        } else {
          alert("Invalid response from server.");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response format:", text);
        alert("Server returned non-JSON response.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading reference image.");
    }
  };

  const handleScan = async () => {
    if (!referenceImageURL) {
      alert("Please upload a reference image.");
      return;
    }

    try {
      setScanning(true);
      const response = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceImage: referenceImageURL,
          imageUrls: allImages.map((img) => ({
            name: img.name,
            url: img.url,
          })),
        }),
      });
      const data = await response.json();
      setMatchedImages(data.matched_images || []);
    } catch (error) {
      alert("Failed to scan images.");
    } finally {
      setScanning(false);
    }
  };

  const imagesToDisplay = matchedImages.length > 0 ? matchedImages : allImages;

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 5,
        p: 3,
        textAlign: "center",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          PersonaScan
        </Typography>

        <TextField
          fullWidth
          label="Google Drive Folder Link"
          variant="outlined"
          value={driveLink}
          onChange={(e) => setDriveLink(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleFetchImages}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Images"}
        </Button>

        <Grid
          container
          spacing={1}
          justifyContent="flex-start"
          sx={{ mb: 2, overflowX: "auto", maxHeight: 160, flexWrap: "nowrap" }}
        >
          {imagesToDisplay.length > 0 &&
            imagesToDisplay.map((image, index) => (
              <Grid item key={index}>
                <Paper sx={{ width: 80, height: 80, overflow: "hidden" }}>
                  <img
                    src={image.url}
                    alt={`image-${index}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </Paper>
              </Grid>
            ))}
        </Grid>

        <Button variant="contained" color="primary" fullWidth component="label" sx={{ mb: 2 }}>
          Upload Reference Image
          <input type="file" hidden onChange={handleReferenceImageUpload} />
        </Button>

        {referenceImageURL && (
          <Paper sx={{ width: 80, height: 80, overflow: "hidden", margin: "auto", mb: 2 }}>
            <img
              src={referenceImageURL}
              alt="reference"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Paper>
        )}

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ py: 1.5 }}
          onClick={handleScan}
          disabled={scanning || allImages.length === 0}
        >
          {scanning ? <CircularProgress size={24} color="inherit" /> : "Scan"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Home;
