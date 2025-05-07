const API_BASE = "http://localhost:8000";

export const fetchImages = async (folderId) => {
  const response = await fetch(`${API_BASE}/fetch-images?folder_id=${folderId}`);
  return await response.json();
};

export const uploadReferenceImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${API_BASE}/upload-reference-image`, {
    method: "POST",
    body: formData,
  });
};

export const scanImages = async (referenceUrl, folderId) => {
  const response = await fetch(referenceUrl);
  const blob = await response.blob();
  const filename = referenceUrl.split("/").pop();

  const formData = new FormData();
  formData.append("reference_image", blob, filename);
  formData.append("folder_link", folderId);

  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};
