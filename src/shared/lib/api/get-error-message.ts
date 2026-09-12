import { isAxiosError } from "axios";

interface ApiErrorEnvelope {
  message?: string;
  // TODO: confirm with backend - the API collection only documents `errors: null`
  // alongside a top-level `message` string for validation failures (duplicate email,
  // wrong password, weak password). There's no confirmed example of `errors` being
  // populated with field-level detail. Once confirmed, extend this to map `errors`
  // onto individual form fields instead of only surfacing a general message.
  errors?: unknown;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError<ApiErrorEnvelope>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
