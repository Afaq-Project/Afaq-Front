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

/** Email field that requests a reset link, then a "check your email" message. */
export default function ForgotPasswordForm() {
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
        <h1 className="text-h1 text-neutral-900">Check your email</h1>
        <p className="mt-1 text-body text-neutral-600">
          If an account exists for <span className="font-medium text-neutral-900 break-all">{sentTo}</span>, we&apos;ve
          sent a link to reset your password. It can take a few minutes to arrive.
        </p>
        <p className="mt-8 text-neutral-600 text-small">
          Didn&apos;t get it? Check your spam folder or{" "}
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 font-medium text-primary-600 hover:underline"
          >
            try again
          </button>
          .
        </p>
        <p className="mt-8 text-small text-center">
          <TextLink href="/login">Back to sign in</TextLink>
        </p>
      </div>
    );
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a link to choose a new password."
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Send reset link"
      submittingLabel="Sending link"
      isSubmitting={isSubmitting}
      errorId="forgot-password-error"
      error={formError}
      showSocial={false}
      switchLabel="Back to sign in"
      switchHref="/login"
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
    </AuthForm>
  );
}
