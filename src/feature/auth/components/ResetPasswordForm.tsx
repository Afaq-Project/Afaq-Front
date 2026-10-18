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

const RULES_ID = "reset-password-rules";

/** The link's token is checked by the API on submit; an expired or used link fails there. */
export default function ResetPasswordForm({ token }: { token: string | null }) {
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
        <h1 className="text-h1 text-neutral-900">This link doesn&apos;t work</h1>
        <p className="mt-1 text-body text-neutral-600">
          The reset link is incomplete. Open it again from your email, or request a new one.
        </p>
        <p className="mt-8 text-small text-center">
          <TextLink href="/forgot-password">Request a new link</TextLink>
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
      title="Choose a new password"
      subtitle="Use a password you don't use anywhere else."
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Reset password"
      submittingLabel="Resetting password"
      isSubmitting={isSubmitting}
      errorId="reset-password-error"
      error={
        formError && (
          <>
            {formError} If your link has expired,{" "}
            <TextLink href="/forgot-password" inline className="text-danger-800! underline">
              request a new one
            </TextLink>
            .
          </>
        )
      }
      showSocial={false}
      switchLabel="Back to sign in"
      switchHref="/login"
    >
      <div className="flex flex-col gap-2">
        <PasswordInput
          id="new-password"
          label="New password"
          autoComplete="new-password"
          aria-describedby={RULES_ID}
          error={errors.newPassword && "Choose a password that meets all the rules below."}
          {...register("newPassword")}
        />
        <PasswordChecklist id={RULES_ID} password={newPassword} />
      </div>
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
    </AuthForm>
  );
}
