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
  // TODO: confirm with backend - the API collection doesn't document the shape of
  // individual role entries.
  roles: unknown[];
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken });
        tokenStorage.setTokens(accessToken, newRefreshToken);

        // Re-fetch rather than trusting any cached user, since it may be stale.
        const freshUser = await apiClient.get<AuthUser>("/auth/me");
        // A login can complete while this was in flight - never let a stale
        // hydrate response clobber a session established after it started.
        if (!loggedInRef.current) setUser(freshUser);
      } catch {
        if (!loggedInRef.current) {
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
    setUser(loggedInUser);
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
