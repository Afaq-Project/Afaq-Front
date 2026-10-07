import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Server-only helpers for the auth BFF routes under src/app/api/auth. The refresh token lives
// in an httpOnly cookie scoped to those routes, so client JavaScript can never read it.

const REFRESH_COOKIE = "afaq_refresh_token";
const REFRESH_COOKIE_PATH = "/api/auth";
// Used when the refresh token isn't a JWT with an `exp` claim.
const FALLBACK_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const BACKEND_TIMEOUT_MS = 20_000;
// Replies from a proxy in front of the backend (e.g. Railway's "Application failed to
// respond") rather than from the backend itself, so they're treated as unreachable.
const GATEWAY_ERROR_STATUSES = [502, 503, 504];

const BACKEND_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

/** Same shape as the backend's ApiEnvelope, so client error handling works unchanged. */
interface Envelope {
  success?: boolean;
  status?: number;
  message?: string;
  data?: unknown;
  errors?: unknown;
  [key: string]: unknown;
}

export interface BackendResult {
  status: number;
  body: Envelope | null;
}

/** Seconds until the token's JWT `exp`, or a fallback when it can't be read. */
function cookieMaxAge(token: string): number {
  try {
    const payload = token.split(".")[1];
    const { exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as { exp?: number };
    if (typeof exp === "number")
      return Math.max(0, Math.floor(exp - Date.now() / 1000));
  } catch {
    // Not a JWT — fall through.
  }
  return FALLBACK_MAX_AGE_SECONDS;
}

const cookieOptions = {
  httpOnly: true,
  // Browsers other than Chrome reject Secure cookies on http://localhost.
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: REFRESH_COOKIE_PATH,
} as const;

export async function readRefreshCookie(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function setRefreshCookie(token: string): Promise<void> {
  (await cookies()).set(REFRESH_COOKIE, token, {
    ...cookieOptions,
    maxAge: cookieMaxAge(token),
  });
}

export async function clearRefreshCookie(): Promise<void> {
  (await cookies()).set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

/**
 * POSTs to the backend. Returns null when it can't be reached: network error, timeout, or a
 * gateway error from the hosting proxy.
 */
export async function backendPost(
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<BackendResult | null> {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
    if (GATEWAY_ERROR_STATUSES.includes(response.status)) return null;
    const text = await response.text();
    let parsed: Envelope | null = null;
    try {
      parsed = text ? (JSON.parse(text) as Envelope) : null;
    } catch {
      parsed = { message: text };
    }
    return { status: response.status, body: parsed };
  } catch {
    return null;
  }
}

/** Relays a backend response as-is (status and body), for errors and pass-through replies. */
export function relay({ status, body }: BackendResult): NextResponse {
  return status === 204
    ? new NextResponse(null, { status })
    : NextResponse.json(body, { status });
}

export function errorResponse(status: number, message: string): NextResponse {
  return NextResponse.json(
    { success: false, status, message, data: null, errors: null },
    { status },
  );
}

export const backendUnreachable = () =>
  errorResponse(502, "Couldn't reach the server. Please try again later.");

/**
 * Takes a successful login/refresh reply, stores its refresh token in the cookie and returns
 * the reply with the refresh token removed, so it never reaches the browser.
 * Login must include a refresh token. Refresh may not (the backend doesn't always rotate it),
 * in which case the existing cookie is kept.
 */
export async function withRefreshTokenInCookie(
  result: BackendResult,
  { requireRefreshToken }: { requireRefreshToken: boolean },
): Promise<NextResponse> {
  const data = result.body?.data as Record<string, unknown> | undefined;
  const refreshToken = data?.refreshToken;
  if (!data || typeof data.accessToken !== "string") {
    return errorResponse(
      502,
      "The server sent an unexpected response. Please try again.",
    );
  }
  if (typeof refreshToken === "string") {
    await setRefreshCookie(refreshToken);
  } else if (requireRefreshToken) {
    return errorResponse(
      502,
      "The server sent an unexpected response. Please try again.",
    );
  }
  const publicData = { ...data };
  delete publicData.refreshToken;
  return NextResponse.json(
    { ...result.body, data: publicData },
    { status: result.status },
  );
}
