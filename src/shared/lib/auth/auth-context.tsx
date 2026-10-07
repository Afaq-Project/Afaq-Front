"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import apiClient from "@/src/shared/lib/api/axios-client";
import { tokenStorage } from "@/src/shared/lib/auth/token-storage";

export interface AuthUserProfile {
  fullName: string;
  completionPct: number;
  isDraft: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  userProfile: AuthUserProfile;
  roles: string[];
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** True when the token is a JWT that stays valid for at least another 30 seconds. */
function isAccessTokenUsable(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === "number" && exp * 1000 - Date.now() > 30_000;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loggedInRef = useRef(false);

  useEffect(() => {
    async function hydrate() {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      // Render right away with the last known user instead of waiting on the network;
      // it is still re-validated against /auth/me below.
      const cachedUser = tokenStorage.getCachedUser<AuthUser>();
      if (cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
      }

      try {
        // Only refresh up front when the stored access token is missing or about to expire —
        // an extra round trip on every page load otherwise. A token that turns out to be
        // rejected is still refreshed by the axios 401 interceptor.
        if (!isAccessTokenUsable(tokenStorage.getAccessToken())) {
          const { accessToken, refreshToken: newRefreshToken } =
            await apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken });
          tokenStorage.setTokens(accessToken, newRefreshToken);
        }

        // Re-fetch rather than trusting the cached user, since it may be stale.
        const freshUser = await apiClient.get<AuthUser>("/auth/me");
        // A login can complete while this was in flight - never let a stale
        // hydrate response clobber a session established after it started.
        if (!loggedInRef.current) {
          setUser(freshUser);
          tokenStorage.setCachedUser(freshUser);
        }
      } catch (error) {
        // A rejected session ends it. A network error or timeout only does when there is no
        // cached user to fall back on — a flaky connection shouldn't log anyone out.
        const rejected =
          isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0);
        if (!loggedInRef.current && (rejected || !cachedUser)) {
          tokenStorage.clearTokens();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken, user: loggedInUser } = await apiClient.post<LoginResponse>(
      "/auth/login",
      { email, password },
    );
    loggedInRef.current = true;
    tokenStorage.setTokens(accessToken, refreshToken);
    tokenStorage.setCachedUser(loggedInUser);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      // Register doesn't return tokens, so sign the user in immediately after.
      await apiClient.post<AuthUser>("/auth/register", payload);
      await login(payload.email, payload.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Best-effort: local state is cleared regardless of the call's outcome.
    }
    tokenStorage.clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: Boolean(user?.roles.includes("system_admin")),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
