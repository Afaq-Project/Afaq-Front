"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import Input from "@/src/shared/ui/Input";
import PasswordInput from "@/src/shared/ui/PasswordInput";
import AuthForm from "./AuthForm";
import TextLink from "./TextLink";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  loginSchema,
  type LoginFormValues,
} from "@/src/shared/lib/validation/auth-schemas";

// TODO: no /forgot-password route exists yet.
const FORGOT_PASSWORD_HREF = "/forgot-password";

// Sentinel for a rejected email/password pair, so the alert can render a link.
const INVALID_CREDENTIALS = "invalid-credentials";

interface LoginFormProps {
  sessionExpired?: boolean;
}

export default function LoginForm({ sessionExpired = false }: LoginFormProps) {
  const { login, isAdmin } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      setFormError(
        isAxiosError(error) && error.response?.status === 401
          ? INVALID_CREDENTIALS
          : getErrorMessage(error),
      );
    }
  };

  return (
    <AuthForm
      title="Log in"
      subtitle="Welcome back. Log in to see your matches."
      notice={
        sessionExpired
          ? "Your session expired. Log back in. Your draft is saved."
          : undefined
      }
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Log in"
      submittingLabel="Logging in…"
      isSubmitting={isSubmitting}
      errorId="login-error"
      error={
        formError === INVALID_CREDENTIALS ? (
          <>
            That email and password don&apos;t match. Try again or{" "}
            <TextLink
              href={FORGOT_PASSWORD_HREF}
              inline
              className="text-danger-800! underline"
            >
              reset your password
            </TextLink>
            .
          </>
        ) : (
          formError
        )
      }
      switchPrompt="Don't have an account?"
      switchLabel="Sign up"
      switchHref="/register"
    >
      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordInput
        id="password"
        label="Password"
        labelAction={
          // Negative margin keeps the 44px mobile tap target without making this label row taller than sign-up's.
          <TextLink href={FORGOT_PASSWORD_HREF} className="max-md:-my-3.5 text-caption">
            Forgot password?
          </TextLink>
        }
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
    </AuthForm>
  );
}
