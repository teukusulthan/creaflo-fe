import { api } from "@/lib/api";
import { getErrMsg } from "@/lib/utils";
import type { ApiResponse } from "@/types/common";

export type HistoryItem = {
  id: string;
  tool: "caption" | "hook" | "idea" | "hashtag";
  inputText: string;
  outputText: string;
  isSaved: boolean;
  createdAt: string;
};

export type ToggleSaveResult = {
  id: string;
  isSaved: boolean;
};

export async function getHistory(limit = 50) {
  try {
    const res = await api.get<ApiResponse<{ items: HistoryItem[] }>>(
      `/history?limit=${limit}`
    );
    return res.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "Failed to fetch history"));
  }
}

export async function toggleSaveGeneration(id: string) {
  try {
    const res = await api.patch<ApiResponse<ToggleSaveResult>>(
      `/${id}/toggle-save`
    );
    return res.data.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "Failed to save"));
  }
}

export async function getSaved() {
  try {
    const res = await api.get<ApiResponse>("/saved");
    return res.data;
  } catch (e) {
    throw new Error(getErrMsg(e, "Failed to save"));
  }
}
