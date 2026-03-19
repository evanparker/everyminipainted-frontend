import { Figure } from "../types/figure.types";
import { apiClient } from "./apiClient";

async function getFigures({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/figures/?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getFiguresBySearch(
  search: string,
  { limit = 20, offset = 0, manufacturer = "" }: { limit?: number; offset?: number; manufacturer?: string }
) {
  const response = await apiClient.get(
    `/figures/search?search=${search}&limit=${limit}&offset=${offset}${
      manufacturer ? `&manufacturer=${manufacturer}` : ""
    }`
  );
  return response;
}

async function getFigure(id: string) {
  const response = await apiClient.get(`/figures/${id}`);
  return response;
}

async function getFigureMinis(id: string, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/figures/${id}/minis?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function postFigure(figure: Figure) {
  const response = await apiClient.post(`/figures/`, figure);
  return response;
}

async function putFigure(id: string, figure: Figure) {
  const response = await apiClient.put(`/figures/${id}`, figure);
  return response;
}

async function deleteFigure(id: string) {
  const response = await apiClient.delete(`/figures/${id}`);
  return response;
}

export {
  getFigure,
  getFigures,
  postFigure,
  putFigure,
  deleteFigure,
  getFiguresBySearch,
  getFigureMinis,
};
