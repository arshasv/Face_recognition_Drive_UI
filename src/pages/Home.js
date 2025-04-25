import React, { useState } from "react";
import { Card, CardContent, Button, Typography, Grid, Paper, TextField } from "@mui/material";

const Home = () => {
  const [driveLink, setDriveLink] = useState("");
  const [imageList, setImageList] = useState([]);
  const [referenceImage, setReferenceImage] = useState(null);

  // Extract folder ID from Google Drive link
  const extractFolderId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    console.log("Extracted Folder ID:", match ? match[0] : "No match found");
    return match ? match[0] : null;
  };

  // Fetch images from Google Drive folder
  const handleFetchImages = async () => {
    const folderId = extractFolderId(driveLink);
    if (!folderId) {
      alert("Invalid Google Drive link");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/fetch-images?folder_id=${folderId}`);
      const data = await response.json();

      if (response.ok) {
        if (data && Array.isArray(data.images)) {
          console.log("Fetched Images:", data.images);

          // Optional: convert Drive links to direct image URLs
          const fixedImages = data.images.map(img => ({
            ...img,
            url: `https://drive.google.com/uc?id=${img.url.split('/').pop()}`
          }));

          setImageList(fixedImages);
        } else {
          alert("No images found in the folder.");
        }
      } else {
        alert(`Error fetching images: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images.");
    }
  };

  // Handle reference image upload
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target.result); // Set the base64-encoded image data
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image scanning
  const handleScan = async () => {
    if (!referenceImage) {
      alert("Please select a reference image to scan.");
      return;
    }

    try {
      console.log("Sending payload to /scan:", {
        referenceImage,
        imageUrls: imageList.map((img) => ({ name: img.name, url: img.url })),
      });

      const response = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceImage,
          imageUrls: imageList.map((img) => ({ name: img.name, url: img.url })),
        }),
      });
      const data = await response.json();
      console.log("Scan result:", data);
      setImageList(data.matched_images || []);
    } catch (error) {
      console.error("Error scanning images:", error);
      alert("Failed to scan images.");
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, textAlign: "center", boxShadow: 3, borderRadius: 2 }}>
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
        <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={handleFetchImages}>
          Fetch Images
        </Button>

        {/* Display Fetched Images */}
        <Grid
          container
          spacing={1}
          justifyContent="flex-start"
          sx={{ mb: 2, overflowX: "auto", maxHeight: 160, flexWrap: "nowrap" }}
        >
          {imageList.length > 0 ? (
            imageList.map((image, index) => (
              <Grid item key={index}>
                <Paper sx={{ width: 80, height: 80, overflow: "hidden" }}>
                  <img
                    src={image.url}
                    alt={`uploaded-${index}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            </Typography>
          )}
        </Grid>

        {/* Upload Reference Image */}
        <Button variant="contained" color="primary" fullWidth component="label" sx={{ mb: 2 }}>
          Upload Reference Image
          <input type="file" hidden onChange={handleImageSelect} />
        </Button>

        {/* Display Uploaded Reference Image */}
        {referenceImage && (
          <Paper sx={{ width: 80, height: 80, overflow: "hidden", margin: "auto", mb: 2 }}>
            <img src={referenceImage} alt="reference" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Paper>
        )}

        {/* Scan Button */}
        <Button variant="contained" color="success" fullWidth sx={{ py: 1.5 }} onClick={handleScan}>
          Scan
        </Button>
      </CardContent>
    </Card>
  );
};

export default Home;
