import { Manufacturer } from "../types/manufacturer.types";
import { apiClient } from "./apiClient";

async function getManufacturers({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/manufacturers/?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getManufacturer(id: string | undefined) {
  const response = await apiClient.get(`/manufacturers/${id}`);
  return response;
}

async function getManufacturerFigures(id: string | undefined, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/manufacturers/${id}/figures?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getManufacturersBySearch(search:string, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/manufacturers/search?search=${search}&limit=${limit}&offset=${offset}`
  );
  return response;
}

async function postManufacturer(manufacturer: Manufacturer) {
  const response = await apiClient.post(`/manufacturers/`, manufacturer);
  return response;
}

async function putManufacturer(id: string | undefined, manufacturer: Manufacturer) {
  const response = await apiClient.put(`/manufacturers/${id}`, manufacturer);
  return response;
}

async function deleteManufacturer(id: string | undefined) {
  const response = await apiClient.delete(`/manufacturers/${id}`);
  return response;
}

export {
  getManufacturer,
  getManufacturers,
  getManufacturerFigures,
  getManufacturersBySearch,
  postManufacturer,
  putManufacturer,
  deleteManufacturer,
};
