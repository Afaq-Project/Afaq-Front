import apiClient from "@/src/shared/lib/api/axios-client";

/** Asks the API to email a reset link to this address. */
export async function requestPasswordReset(email: string) {
  await apiClient.post("/auth/forgot-password", { email });
}

/** Sets a new password with the token from the emailed link. */
export async function resetPassword(payload: { token: string; password: string; confirmPassword: string }) {
  await apiClient.post("/auth/reset-password", payload);
}
