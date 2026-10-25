"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "@/src/shared/ui/Input";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/src/shared/lib/validation/auth-schemas";
import { requestPasswordReset } from "../services/passwordReset";
import AuthForm from "./AuthForm";
import TextLink from "./TextLink";
import { useTranslations } from "next-intl";
import { useErrorText } from "@/src/shared/lib/validation/useErrorText";

/** Email field that requests a reset link, then a "check your email" message. */
export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const errorText = useErrorText();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    setFormError(null);
    try {
      await requestPasswordReset(email);
      setSentTo(email);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  if (sentTo) {
    return (
      <div role="status">
        <h1 className="text-h1 text-neutral-900">{t("forgot.sentTitle")}</h1>
        <p className="mt-1 text-body text-neutral-600">
          {t.rich("forgot.sentBody", {
            email: sentTo,
            strong: (chunks) => <span className="font-medium text-neutral-900 break-all">{chunks}</span>,
          })}
        </p>
        <p className="mt-8 text-neutral-600 text-small">
          {t.rich("forgot.notReceived", {
            retry: (chunks) => (
              <button
                type="button"
                onClick={() => setSentTo(null)}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 font-medium text-primary-600 hover:underline"
              >
                {chunks}
              </button>
            ),
          })}
        </p>
        <p className="mt-8 text-small text-center">
          <TextLink href="/login">{t("backToSignIn")}</TextLink>
        </p>
      </div>
    );
  }

  return (
    <AuthForm
      title={t("forgot.title")}
      subtitle={t("forgot.subtitle")}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={t("forgot.submit")}
      submittingLabel={t("forgot.submitting")}
      isSubmitting={isSubmitting}
      errorId="forgot-password-error"
      error={formError}
      showSocial={false}
      switchLabel={t("backToSignIn")}
      switchHref="/login"
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
    </AuthForm>
  );
}
