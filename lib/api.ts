import axios, { AxiosHeaders, type AxiosRequestHeaders } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let bearerToken: string | null = null;

export function setBearerToken(token: string | null) {
  bearerToken = token;
  if (!token) return;
}

api.interceptors.request.use((config) => {
  if (!bearerToken) return config;

  const tokenValue = `Bearer ${bearerToken}`;

  // Pastikan selalu ada headers
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", tokenValue);
  } else {
    (config.headers as AxiosRequestHeaders)["Authorization"] = tokenValue;
  }

  return config;
});

export default api;
