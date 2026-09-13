import { isAxiosError } from "axios";

interface ApiErrorItem {
  field?: string;
  code?: string;
  message?: string;
}

interface ApiErrorEnvelope {
  message?: string;
  errors?: ApiErrorItem[] | Record<string, unknown> | string | null;
  statusCode?: number;
  status?: number;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError<ApiErrorEnvelope>(error)) {
    const data = error.response?.data;
    if (data) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === "string") return first;
        if (first && typeof first === "object" && first.message) {
          return first.message;
        }
      }
      if (typeof data.errors === "string") {
        return data.errors;
      }
      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message;
      }
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

