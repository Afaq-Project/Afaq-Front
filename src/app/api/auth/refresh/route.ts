import {
  backendPost,
  backendUnreachable,
  clearRefreshCookie,
  errorResponse,
  readRefreshCookie,
  relay,
  setRefreshCookie,
  withRefreshTokenInCookie,
} from "@/src/shared/lib/auth/server/bff";

/** Swaps the refresh-token cookie for a new access token, rotating the cookie if the backend does. */
export async function POST(request: Request) {
  // Sessions from before the cookie existed send their stored refresh token once, so they
  // can move to the cookie without being signed out. The cookie always wins.
  // TODO: remove the body fallback once existing sessions have migrated.
  const body: unknown = await request.json().catch(() => null);
  const legacyToken =
    body && typeof body === "object" && "refreshToken" in body && typeof body.refreshToken === "string"
      ? body.refreshToken
      : undefined;

  const cookieToken = await readRefreshCookie();
  const refreshToken = cookieToken ?? legacyToken;
  if (!refreshToken) return errorResponse(401, "Not signed in.");

  const result = await backendPost("/auth/refresh", { refreshToken });
  if (!result) return backendUnreachable();
  if (result.status >= 400) {
    // A rejected token is dead — drop the cookie so the next load doesn't retry it.
    if (result.status === 401 || result.status === 403) await clearRefreshCookie();
    return relay(result);
  }

  // A legacy token arriving without a cookie must end up in one, rotated or not.
  if (!cookieToken && legacyToken) await setRefreshCookie(legacyToken);
  return withRefreshTokenInCookie(result, { requireRefreshToken: false });
}
