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

const TIMEOUT_MESSAGE = "The server is taking too long to respond. Please try again.";
const NETWORK_MESSAGE = "Couldn't reach the server. Check your connection and try again.";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError<ApiErrorEnvelope>(error)) {
    // No response at all: the request timed out or never reached the server.
    if (!error.response) {
      return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
        ? TIMEOUT_MESSAGE
        : NETWORK_MESSAGE;
    }
    // A non-JSON body (e.g. an HTML error page) arrives as a string.
    const data = typeof error.response.data === "object" ? error.response.data : undefined;
    const errors = data?.errors;
    const fieldMessages = Array.isArray(errors)
      ? errors.map((e) => e.message).filter(Boolean)
      : [];
    if (fieldMessages.length > 0) return fieldMessages.join(" ");
    return data?.message ?? fallback;
  }
  return fallback;
}
