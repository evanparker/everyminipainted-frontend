import { apiClient } from "./apiClient";

async function postLogin(loginInfo: {
  email: string;
  password: string;
}) {
  const response = await apiClient.post(`/auth/login`, loginInfo);
  return response;
}

async function postSignup(signupInfo: {
  username: string;
  email: string;
  password: string;
  invite?: string;
}) {
  const response = await apiClient.post(`/auth/signup`, signupInfo);
  return response;
}

async function postLogout() {
  const response = await apiClient.post(`/auth/logout`, {});
  return response;
}

async function putPassword(passwordInfo: { password: string }) {
  const response = await apiClient.put(`/auth/password`, passwordInfo);
  return response;
}

async function postForgotPassword(emailInfo: { email: string }) {
  const response = await apiClient.post(`/auth/forgotpassword`, emailInfo);
  return response;
}

async function postResetPassword(info: { userId: string; token: string; password: string }) {
  const response = await apiClient.post(`/auth/resetpassword`, info);
  return response;
}

export {
  postLogin,
  postSignup,
  postLogout,
  putPassword,
  postForgotPassword,
  postResetPassword,
};
