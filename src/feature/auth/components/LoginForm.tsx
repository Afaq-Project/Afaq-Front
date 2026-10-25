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
import { useTranslations } from "next-intl";
import { useErrorText } from "@/src/shared/lib/validation/useErrorText";

const FORGOT_PASSWORD_HREF = "/forgot-password";

// Sentinel for a rejected email/password pair, so the alert can render a link.
const INVALID_CREDENTIALS = "invalid-credentials";

/**
 * A wrong email/password pair: a 401 with AUTH_INVALID_CREDENTIALS (or no code at all). Other
 * 401s, e.g. an unverified or inactive account, show the API's own message instead of
 * "don't match".
 */
function isInvalidCredentials(error: unknown) {
  if (!isAxiosError<{ errors?: { code?: string }[] | null }>(error) || error.response?.status !== 401) {
    return false;
  }
  const code = error.response.data?.errors?.[0]?.code;
  return !code || code === "AUTH_INVALID_CREDENTIALS";
}

interface LoginFormProps {
  sessionExpired?: boolean;
  /** Just came from a successful password reset. */
  passwordReset?: boolean;
}

export default function LoginForm({ sessionExpired = false, passwordReset = false }: LoginFormProps) {
  const t = useTranslations("auth");
  const errorText = useErrorText();
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
      setFormError(isInvalidCredentials(error) ? INVALID_CREDENTIALS : getErrorMessage(error));
    }
  };

  return (
    <AuthForm
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      notice={
        passwordReset
          ? t("login.passwordReset")
          : sessionExpired
            ? t("login.sessionExpired")
            : undefined
      }
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={t("login.submit")}
      submittingLabel={t("login.submitting")}
      isSubmitting={isSubmitting}
      errorId="login-error"
      error={
        formError === INVALID_CREDENTIALS ? (
          t.rich("login.invalidCredentials", {
            link: (chunks) => (
              <TextLink href={FORGOT_PASSWORD_HREF} inline className="text-danger-800! underline">
                {chunks}
              </TextLink>
            ),
          })
        ) : (
          formError
        )
      }
      switchPrompt={t("login.noAccount")}
      switchLabel={t("login.signUp")}
      switchHref="/register"
    >
      <Input
        id="email"
        type="email"
        label={t("email")}
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        error={errorText(errors.email?.message)}
        {...register("email")}
      />

      <PasswordInput
        id="password"
        label={t("password")}
        labelAction={
          // Negative margin keeps the 44px mobile tap target without making this label row taller than sign-up's.
          <TextLink href={FORGOT_PASSWORD_HREF} className="max-md:-my-3.5 text-caption">
            {t("login.forgotPassword")}
          </TextLink>
        }
        autoComplete="current-password"
        error={errorText(errors.password?.message)}
        {...register("password")}
      />
    </AuthForm>
  );
}
