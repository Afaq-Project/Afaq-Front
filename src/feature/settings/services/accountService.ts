/**
 * Account actions for the Settings page. None of these has a backend call yet: the client has
 * no password-change, OAuth, export or deletion endpoints. Each one is stubbed here (a short
 * delay, then success) so the UI flows are complete and the swap is one file.
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

// TODO: POST the current and new password once a change-password endpoint exists.
export async function changePassword(values: { currentPassword: string; newPassword: string }) {
  await stub(values);
}

// TODO: set a first password for OAuth-only accounts once the endpoint exists.
export async function setPassword(values: { newPassword: string }) {
  await stub(values);
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
