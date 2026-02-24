import { apiClient } from "./apiClient";

async function getCollections({ limit = 20, offset = 0 }) {
  const response = await apiClient.get(
    `/collections/?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollectionsByFigure({
  figureId = "",
  limit = 20,
  offset = 0,
}) {
  const response = await apiClient.get(
    `/collections/figure/${figureId}?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollectionsBySearch(search, { limit = 20, offset = 0 }) {
  const response = await apiClient.get(
    `/collections/search?search=${search}&limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollection(id) {
  const response = await apiClient.get(`/collections/${id}`);
  return response;
}

async function postCollection(collection) {
  const response = await apiClient.post(`/collections/`, collection);
  return response;
}

async function putCollection(id, collection) {
  const response = await apiClient.put(`/collections/${id}`, collection);
  return response;
}

async function deleteCollection(id) {
  const response = await apiClient.delete(`/collections/${id}`);
  return response;
}

export {
  getCollection,
  getCollections,
  getCollectionsByFigure,
  postCollection,
  putCollection,
  deleteCollection,
  getCollectionsBySearch,
};
