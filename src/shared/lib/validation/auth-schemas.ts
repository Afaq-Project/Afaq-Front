import { z } from "zod";

/** The password rules, in plain words, for the live checklist under a new-password field. Must match passwordSchema. */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "A letter", test: (value: string) => /[A-Za-z]/.test(value) },
  { label: "A number", test: (value: string) => /[0-9]/.test(value) },
];

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

const PASSWORD_MISMATCH = { message: "Passwords don't match", path: ["confirmPassword"] };

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, PASSWORD_MISMATCH);

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/** For accounts that only log in with Google or LinkedIn: no current password to check. */
export const setPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, PASSWORD_MISMATCH);

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
