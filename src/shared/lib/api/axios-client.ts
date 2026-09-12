import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../auth/token-storage";

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

// Concurrent 401s must trigger a single refresh call, not one per request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshTokens(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<
      ApiEnvelope<{ accessToken: string; refreshToken: string }>
    >(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    // Refresh tokens rotate on every call - both must be overwritten, not just the access token.
    tokenStorage.setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    return null;
  }
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
  (response) => response.data.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

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
