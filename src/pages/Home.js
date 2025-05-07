import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

import Header from "../components/Header";
import ImageGrid from "../components/ImageGrid";
import ReferenceImagePreview from "../components/ReferenceImagePreview";

import { fetchImages, uploadReferenceImage, scanImages } from "../services/api";
import { extractFolderId } from "../utils/helpers";

const Home = () => {
  const [driveLink, setDriveLink] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [matchedImages, setMatchedImages] = useState([]);
  const [referenceImageURL, setReferenceImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleFetchImages = async () => {
    const folderId = extractFolderId(driveLink);
    if (!folderId) {
      alert("Invalid Google Drive link");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchImages(folderId);
      if (data?.images?.length) {
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
    try {
      const file = event.target.files[0];
      const response = await uploadReferenceImage(file);

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
        alert("Server returned non-JSON response.");
      }
    } catch (error) {
      alert("Error uploading reference image.");
    }
  };

  const handleScan = async () => {
    const folderId = extractFolderId(driveLink);
    if (!referenceImageURL || !folderId) {
      alert("Please upload a reference image and enter a Drive folder link.");
      return;
    }

    try {
      setScanning(true);
      const data = await scanImages(referenceImageURL, folderId);
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
        <Header />

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

        {imagesToDisplay.length > 0 && <ImageGrid images={imagesToDisplay} />}

        <Button variant="contained" color="primary" fullWidth component="label" sx={{ mb: 2 }}>
          Upload Reference Image
          <input type="file" hidden onChange={handleReferenceImageUpload} />
        </Button>

        {referenceImageURL && (
          <ReferenceImagePreview
            imageUrl={referenceImageURL}
            onRemove={() => setReferenceImageURL(null)}
          />
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
