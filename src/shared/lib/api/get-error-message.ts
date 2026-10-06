import { isAxiosError } from "axios";

interface ApiFieldError {
  field?: string;
  code?: string;
  message?: string;
}

interface ApiErrorEnvelope {
  message?: string;
  // Validation failures return a generic `message` ("Validation failed") with the
  // specifics in `errors`, e.g. [{ field, code, message }]. Other failures send `errors: null`.
  errors?: ApiFieldError[] | null;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError<ApiErrorEnvelope>(error)) {
    const data = error.response?.data;
    const errors = data?.errors;
    const fieldMessages = Array.isArray(errors)
      ? errors.map((e) => e.message).filter(Boolean)
      : [];
    if (fieldMessages.length > 0) return fieldMessages.join(" ");
    return data?.message ?? fallback;
  }
  return fallback;
}
