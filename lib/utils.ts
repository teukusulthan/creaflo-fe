import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorWithResponse = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
};

export function getErrMsg(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    const err = error as ErrorWithResponse;

    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
  }

  return fallback;
}
