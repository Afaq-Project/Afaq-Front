import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../auth/token-storage";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Resolve with the full ApiEnvelope instead of just its `data`. */
    rawEnvelope?: boolean;
  }
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  meta: unknown;
  errors: unknown;
  timestamp: string;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Every response body is wrapped in ApiEnvelope; the response interceptor below
// unwraps `.data` so callers work with clean payloads. This interface corrects the
// return types to match that runtime behavior (axios's own types assume AxiosResponse).
interface UnwrappingAxiosInstance extends Omit<
  AxiosInstance,
  "get" | "post" | "put" | "patch" | "delete"
> {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Kept as a plain AxiosInstance internally so it stays callable for the retry
// below; only the exported `apiClient` is cast to the unwrapped-response type.
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Without a timeout a hung request keeps the UI loading forever.
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Same-origin client for the auth BFF routes (src/app/api/auth). They hold the refresh token
 * in an httpOnly cookie, which the browser attaches automatically. Responses keep the full
 * ApiEnvelope; errors are the backend's, relayed unchanged.
 */
export const authBffClient = axios.create({
  baseURL: "/api/auth",
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function requestAccessToken(): Promise<string> {
  // Sessions from before the cookie still have their refresh token in localStorage; send it
  // once so the BFF can move it into the cookie.
  const legacyRefreshToken = tokenStorage.getLegacyRefreshToken();
  try {
    const response = await authBffClient.post<ApiEnvelope<{ accessToken: string }>>(
      "/refresh",
      legacyRefreshToken ? { refreshToken: legacyRefreshToken } : undefined,
    );
    const { accessToken } = response.data.data;
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.clearLegacyTokens();
    return accessToken;
  } catch (error) {
    // A rejected legacy token is dead too; a network error leaves it for the next try.
    if (isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
      tokenStorage.clearLegacyTokens();
    }
    throw error;
  }
}

// Concurrent callers (page-load hydrate, parallel 401s) share one refresh call. If the
// backend rotates refresh tokens, two calls would spend the same token and end the session.
let refreshPromise: Promise<string> | null = null;

/** Gets a new access token via the refresh cookie. Rejects with the axios error on failure. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = requestAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Auth endpoints return their own 401s (wrong password, unverified email, expired
// refresh token) that callers need to see as-is - they must never trigger the
// access-token refresh/redirect flow below, which is only for authenticated requests.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

function isAuthEndpoint(url?: string): boolean {
  return Boolean(url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint)));
}

instance.interceptors.response.use(
  // `rawEnvelope` keeps the whole envelope, for callers that need `meta` (e.g. pagination).
  (response) => (response.config.rawEnvelope ? response.data : response.data.data),
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken().catch(() => null);

      if (newAccessToken) {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );
        return instance(originalRequest);
      }

      tokenStorage.clearTokens();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

const apiClient = instance as unknown as UnwrappingAxiosInstance;

export default apiClient;
