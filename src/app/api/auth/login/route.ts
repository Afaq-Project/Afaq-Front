import {
  backendPost,
  backendUnreachable,
  errorResponse,
  relay,
  withRefreshTokenInCookie,
} from "@/src/shared/lib/auth/server/bff";

/** Signs in via the backend; keeps the refresh token in an httpOnly cookie. */
export async function POST(request: Request) {
  const credentials: unknown = await request.json().catch(() => null);
  if (!credentials || typeof credentials !== "object") {
    return errorResponse(400, "Invalid request body.");
  }

  const result = await backendPost("/auth/login", credentials);
  if (!result) return backendUnreachable();
  if (result.status >= 400) return relay(result);

  return withRefreshTokenInCookie(result, { requireRefreshToken: true });
}
