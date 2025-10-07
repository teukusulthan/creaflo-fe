import { api } from "@/lib/api";
import { getErrMsg } from "@/lib/utils";
import type { ApiResponse } from "@/types/common";
import type { RegisterPayload } from "@/types/auth";

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
