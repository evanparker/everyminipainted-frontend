import { Image } from "../types/image.types";
import { apiClient } from "./apiClient";

async function getImage(id: string | undefined) {
  if (!id) return undefined;
  const response = await apiClient.get(`/images/${id}`);
  return response;
}

async function postImage(imageFile: File, signal: AbortSignal) {
  const formData = new FormData();
  const fields = {
    file: imageFile,
  };

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const response = await apiClient.postFormData(`/images/`, formData, signal);
  return response;
}

async function putImage(id: string | undefined, image: Image) {
  if (!id) return undefined;
  const response = await apiClient.put(`/images/${id}`, image);
  return response;
}

export { getImage, postImage, putImage };
