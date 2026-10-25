"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { PasswordChecklist } from "@/src/shared/ui/PasswordChecklist";
import PasswordInput from "@/src/shared/ui/PasswordInput";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from "@/src/shared/lib/validation/auth-schemas";
import { resetPassword } from "../services/passwordReset";
import AuthForm from "./AuthForm";
import TextLink from "./TextLink";
import { useTranslations } from "next-intl";
import { useErrorText } from "@/src/shared/lib/validation/useErrorText";

const RULES_ID = "reset-password-rules";

/** The link's token is checked by the API on submit; an expired or used link fails there. */
export default function ResetPasswordForm({ token }: { token: string | null }) {
  const t = useTranslations("auth");
  const errorText = useErrorText();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onTouched",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const newPassword = useWatch({ control, name: "newPassword" });

  if (!token) {
    return (
      <div>
        <h1 className="text-h1 text-neutral-900">{t("reset.brokenTitle")}</h1>
        <p className="mt-1 text-body text-neutral-600">
          {t("reset.brokenBody")}
        </p>
        <p className="mt-8 text-small text-center">
          <TextLink href="/forgot-password">{t("reset.requestNew")}</TextLink>
        </p>
      </div>
    );
  }

  const onSubmit = async ({ newPassword, confirmPassword }: SetPasswordFormValues) => {
    setFormError(null);
    try {
      await resetPassword({ token, password: newPassword, confirmPassword });
      router.push("/login?reset=success");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <AuthForm
      title={t("reset.title")}
      subtitle={t("reset.subtitle")}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={t("reset.submit")}
      submittingLabel={t("reset.submitting")}
      isSubmitting={isSubmitting}
      errorId="reset-password-error"
      error={
        formError && (
          <>
            {formError}{" "}
            {t.rich("reset.expired", {
              link: (chunks) => (
                <TextLink href="/forgot-password" inline className="text-danger-800! underline">
                  {chunks}
                </TextLink>
              ),
            })}
          </>
        )
      }
      showSocial={false}
      switchLabel={t("backToSignIn")}
      switchHref="/login"
    >
      <div className="flex flex-col gap-2">
        <PasswordInput
          id="new-password"
          label={t("reset.newPassword")}
          autoComplete="new-password"
          aria-describedby={RULES_ID}
          error={errors.newPassword && t("reset.meetRules")}
          {...register("newPassword")}
        />
        <PasswordChecklist id={RULES_ID} password={newPassword} />
      </div>
      <PasswordInput
        id="confirm-password"
        label={t("reset.confirmPassword")}
        autoComplete="new-password"
        error={errorText(errors.confirmPassword?.message)}
        {...register("confirmPassword")}
      />
    </AuthForm>
  );
}
