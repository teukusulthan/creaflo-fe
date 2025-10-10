import axios from "axios";

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
  if (bearerToken) {
    config.headers = config.headers || {};
    if (config.headers.set) {
      config.headers.set("Authorization", `Bearer ${bearerToken}`);
    } else {
      (config.headers as any)["Authorization"] = `Bearer ${bearerToken}`;
    }
  }
  return config;
});

export default api;
