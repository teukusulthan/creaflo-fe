import { api } from "@/lib/api";
import { getErrMsg } from "@/lib/utils";
import type { ApiResponse } from "@/types/common";
import type { RegisterPayload } from "@/types/auth";

export type MeUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export async function registerRequest(body: RegisterPayload) {
  try {
    const res = await api.post<ApiResponse>("/auth/register", body);
    return res.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "Registration failed"));
  }
}

export async function loginRequest(body: { email: string; password: string }) {
  try {
    const res = await api.post<ApiResponse<{ token?: string }>>(
      "/auth/login",
      body
    );
    return res.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "Login failed"));
  }
}

export async function getMe() {
  try {
    const res = await api.get<ApiResponse>("/auth/me");
    return res.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "User fetched"));
  }
}
