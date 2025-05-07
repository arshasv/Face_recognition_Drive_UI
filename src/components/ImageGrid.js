import { ImageList, ImageListItem } from "@mui/material";

const ImageGrid = ({ images }) => (
  <ImageList sx={{ width: 500, height: 450, mb: 2 }} cols={3} rowHeight={164}>
    {images.map((item, index) => (
      <ImageListItem key={index}>
        <img
          src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
          srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          alt={`image-${index}`}
          loading="lazy"
        />
      </ImageListItem>
    ))}
  </ImageList>
);

export default ImageGrid;
