import apiClient from "@/src/shared/lib/api/axios-client";

/**
 * Account actions for the Settings page. Password change calls the API; the rest have no
 * endpoint yet and are stubbed here (a short delay, then success) so the UI flows are complete
 * and each swap is one function.
 */

// TODO: replace with the real support address or a contact route; carried over from the old "Need help?" card.
export const SUPPORT_EMAIL = "support@levora.app";

export type Provider = "google" | "linkedin";

export const PROVIDER_NAMES: Record<Provider, string> = { google: "Google", linkedin: "LinkedIn" };

/** How an account can log in. */
export interface LoginMethods {
  hasPassword: boolean;
  /** Connected providers and the email each is connected as. */
  providers: Partial<Record<Provider, string>>;
}

/**
 * TODO: read from the API once /auth/me reports login methods. Until then every account has a
 * password: registration is email + password only, and the Google/LinkedIn sign-in buttons
 * aren't wired up yet, so no account can have a provider.
 */
export const INITIAL_LOGIN_METHODS: LoginMethods = { hasPassword: true, providers: {} };

/** Stand-in for a request: resolves with what would have been sent, after a short delay. */
const stub = <T,>(payload: T) => new Promise<T>((resolve) => setTimeout(() => resolve(payload), 600));

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * A wrong current password is rejected by the API and shown in the form. A 401 here first goes
 * through the client's refresh-and-retry, so an expired access token still works.
 */
export async function changePassword(payload: ChangePasswordPayload) {
  await apiClient.post("/auth/change-password", payload);
}

/**
 * TODO: the API has no "set a first password" endpoint for OAuth-only accounts. Unreachable for
 * now (every account has a password), and it fails rather than pretend to succeed.
 */
export async function setPassword(values: { newPassword: string }) {
  await stub(values);
  throw new Error("Setting a password isn't available yet.");
}

// TODO: start the provider's OAuth flow (redirect) once it exists; for now this only flips local state.
export async function connectProvider(provider: Provider) {
  await stub(provider);
}

// TODO: revoke the provider link once the endpoint exists; for now this only flips local state.
export async function disconnectProvider(provider: Provider) {
  await stub(provider);
}

// TODO: confirm the real export process and timeframe (copy says 7 days) and call the endpoint.
export async function requestDataExport() {
  await stub(null);
}

// TODO: confirm the real deletion process and timeframe (copy says 30 days) and call the endpoint.
export async function requestAccountDeletion() {
  await stub(null);
}
