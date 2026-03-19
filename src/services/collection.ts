import { Collection } from "../types/collection.types";
import { apiClient } from "./apiClient";

async function getCollections({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/collections/?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollectionsByFigure({
  figureId = "",
  limit = 20,
  offset = 0,
}: { figureId?: string; limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/collections/figure/${figureId}?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollectionsBySearch(search: string, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/collections/search?search=${search}&limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getCollection(id: string) {
  const response = await apiClient.get(`/collections/${id}`);
  return response;
}

async function postCollection(collection: Collection) {
  const response = await apiClient.post(`/collections/`, collection);
  return response;
}

async function putCollection(id: string, collection: Collection) {
  const response = await apiClient.put(`/collections/${id}`, collection);
  return response;
}

async function deleteCollection(id: string) {
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
