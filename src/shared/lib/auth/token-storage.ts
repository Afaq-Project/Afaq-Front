const ACCESS_TOKEN_KEY = "levora_access_token";
const REFRESH_TOKEN_KEY = "levora_refresh_token";
// Last known user, so the app can render before /auth/me answers. Always re-validated.
const CACHED_USER_KEY = "levora_cached_user";

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getCachedUser<T>(): T | null {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(CACHED_USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  setCachedUser(user: unknown): void {
    if (!isBrowser()) return;
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
  },

  /** Ends the local session: tokens and the cached user go together. */
  clearTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CACHED_USER_KEY);
  },
};
