// The access token lives only in memory; the refresh token is an httpOnly cookie managed by the
// auth BFF routes (src/app/api/auth), so neither can be read from localStorage by injected script.
// Last known user, so the app can render before /auth/me answers. Always re-validated.
const CACHED_USER_KEY = "levora_cached_user";
// Where tokens were stored before the cookie. Read once to migrate the session, then removed.
const LEGACY_ACCESS_TOKEN_KEY = "levora_access_token";
const LEGACY_REFRESH_TOKEN_KEY = "levora_refresh_token";

let accessToken: string | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string): void {
    accessToken = token;
  },

  /** Refresh token left in localStorage by builds before the cookie, if any. */
  getLegacyRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  },

  clearLegacyTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
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

  /** Ends the local session: the in-memory token, the cached user and any legacy tokens. */
  clearTokens(): void {
    accessToken = null;
    if (!isBrowser()) return;
    localStorage.removeItem(CACHED_USER_KEY);
    tokenStorage.clearLegacyTokens();
  },
};
