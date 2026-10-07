import { NextResponse } from "next/server";
import { backendPost, clearRefreshCookie } from "@/src/shared/lib/auth/server/bff";

/** Logs out on the backend (best effort) and always clears the refresh-token cookie. */
export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  await backendPost(
    "/auth/logout",
    undefined,
    authorization ? { Authorization: authorization } : undefined,
  );
  await clearRefreshCookie();
  return new NextResponse(null, { status: 204 });
}
