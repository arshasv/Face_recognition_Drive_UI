import React from "react";

const ImageSelect = ({ imageList, onSelect }) => {
  return (
    <select onChange={onSelect} style={{ width: "100%", padding: "8px", marginBottom: "10px" }}>
      <option value="">Select an image</option>
      {imageList.map((img, index) => (
        <option key={index} value={img}>{img}</option>
      ))}
    </select>
  );
};

export default ImageSelect;