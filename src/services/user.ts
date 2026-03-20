import { User } from "../types/user.types";
import { apiClient } from "./apiClient";

async function getMinisByUsername(username: string, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
  const response = await apiClient.get(
    `/users/${username}/minis?limit=${limit}&offset=${offset}`
  );
  return response;
}

async function getUserByMe() {
  const token = localStorage.getItem("token");
  const parsedToken = token && JSON.parse(token);
  if (!parsedToken) {
    return {};
  }
  const response = await apiClient.get(`/users/me`);
  return response;
}

async function getUserByUsername(username: string) {
  const response = await apiClient.get(`/users/${username}`);
  return response;
}

async function putUser(id: string, user: User) {
  const response = await apiClient.put(`/users/${id}`, user);
  return response;
}

async function addFavorite(id: string | undefined) {
  if (!id) {
    return null;
  }
  const response = await apiClient.put(`/users/me/setfavorite`, {
    id,
    value: true,
  });
  return response;
}

async function removeFavorite(id: string | undefined) {
  if (!id) {
    return null;
  }
  const response = await apiClient.put(`/users/me/setfavorite`, {
    id,
    value: false,
  });
  return response;
}

export {
  getMinisByUsername,
  getUserByMe,
  getUserByUsername,
  putUser,
  addFavorite,
  removeFavorite,
};
