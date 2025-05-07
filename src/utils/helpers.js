export const extractFolderId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };
  