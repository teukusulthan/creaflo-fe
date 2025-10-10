import { api } from "@/lib/api";
import { getErrMsg } from "@/lib/utils";
import type { ApiResponse } from "@/types/common";
import type { RegisterPayload } from "@/types/auth";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export async function registerRequest(body: RegisterPayload) {
  try {
    const res = await api.post<ApiResponse<{ user: User; token?: string }>>(
      "/auth/register",
      body
    );
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

export async function logoutRequest() {
  try {
    await api.post<ApiResponse>("/auth/logout");
    return true;
  } catch (e) {
    throw new Error(getErrMsg(e, "Logout failed"));
  }
}

export async function meRequest(): Promise<User | null> {
  try {
    const res = await api.get<ApiResponse<{ user: User | null }>>("/auth/me");
    return res.data?.data?.user ?? null;
  } catch (e) {
    throw new Error(getErrMsg(e, "Fetch user failed"));
  }
}
