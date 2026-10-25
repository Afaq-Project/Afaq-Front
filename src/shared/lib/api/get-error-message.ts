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

// Plain function with many callers, so it can't use the translation hook. Errors surface in the
// browser, where <html lang> already holds the saved language. The server's own messages stay as sent.
const MESSAGES = {
  en: {
    timeout: "The server is taking too long to respond. Please try again.",
    network: "Couldn't reach the server. Check your connection and try again.",
    generic: "Something went wrong. Please try again.",
  },
  ar: {
    timeout: "يستغرق الخادم وقتًا طويلًا للرد. حاول مرة أخرى.",
    network: "تعذّر الوصول إلى الخادم. تحقّق من اتصالك وحاول مرة أخرى.",
    generic: "حدث خطأ ما. حاول مرة أخرى.",
  },
};

const messages = () =>
  typeof document !== "undefined" && document.documentElement.lang === "ar" ? MESSAGES.ar : MESSAGES.en;

export function getErrorMessage(error: unknown, fallback?: string): string {
  const text = messages();
  if (isAxiosError<ApiErrorEnvelope>(error)) {
    // No response at all: the request timed out or never reached the server.
    if (!error.response) {
      return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" ? text.timeout : text.network;
    }
    // A non-JSON body (e.g. an HTML error page) arrives as a string.
    const data = typeof error.response.data === "object" ? error.response.data : undefined;
    const errors = data?.errors;
    const fieldMessages = Array.isArray(errors)
      ? errors.map((e) => e.message).filter(Boolean)
      : [];
    if (fieldMessages.length > 0) return fieldMessages.join(" ");
    return data?.message ?? fallback ?? text.generic;
  }
  return fallback ?? text.generic;
}
