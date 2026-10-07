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
import apiClient, {
  authBffClient,
  refreshAccessToken,
  type ApiEnvelope,
} from "@/src/shared/lib/api/axios-client";
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

/** The BFF keeps the refresh token in an httpOnly cookie and only returns these. */
interface LoginResponse {
  accessToken: string;
  user: AuthUser;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loggedInRef = useRef(false);

  useEffect(() => {
    async function hydrate() {
      // Render right away with the last known user instead of waiting on the network;
      // it is still re-validated against /auth/me below.
      const cachedUser = tokenStorage.getCachedUser<AuthUser>();
      if (cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
      }

      try {
        // The access token only lives in memory, so each page load gets a new one from the
        // httpOnly refresh cookie. No cookie (signed out) comes back as a fast 401.
        await refreshAccessToken();

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
    const response = await authBffClient.post<ApiEnvelope<LoginResponse>>("/login", {
      email,
      password,
    });
    const { accessToken, user: loggedInUser } = response.data.data;
    loggedInRef.current = true;
    tokenStorage.clearLegacyTokens();
    tokenStorage.setAccessToken(accessToken);
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
      // Goes through the BFF so it can clear the httpOnly refresh cookie.
      const accessToken = tokenStorage.getAccessToken();
      await authBffClient.post("/logout", undefined, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
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
