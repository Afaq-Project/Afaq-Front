import { z } from "zod";
import { validationMessage as v } from "./useErrorText";

/**
 * The password rules, for the live checklist under a new-password field (labels are keys under
 * passwordRules). Must match passwordSchema.
 */
export const PASSWORD_RULES = [
  { key: "minLength", test: (value: string) => value.length >= 8 },
  { key: "letter", test: (value: string) => /[A-Za-z]/.test(value) },
  { key: "number", test: (value: string) => /[0-9]/.test(value) },
] as const;

// Error messages are validation message keys; forms show them through useErrorText.
export const passwordSchema = z
  .string()
  .min(8, v("passwordMin"))
  .regex(/[A-Za-z]/, v("passwordLetter"))
  .regex(/[0-9]/, v("passwordNumber"));

const emailSchema = z.string().min(1, v("emailRequired")).email(v("emailInvalid"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, v("passwordRequired")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, v("firstNameRequired")),
  lastName: z.string().min(1, v("lastNameRequired")),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

const PASSWORD_MISMATCH = { message: v("passwordMismatch"), path: ["confirmPassword"] };

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, v("currentPasswordRequired")),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, v("confirmPasswordRequired")),
  })
  .refine((values) => values.newPassword === values.confirmPassword, PASSWORD_MISMATCH);

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/** For accounts that only log in with Google or LinkedIn: no current password to check. */
export const setPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, v("confirmPasswordRequired")),
  })
  .refine((values) => values.newPassword === values.confirmPassword, PASSWORD_MISMATCH);

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
