"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import Button from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { PasswordChecklist } from "@/src/shared/ui/PasswordChecklist";
import PasswordInput from "@/src/shared/ui/PasswordInput";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  changePasswordSchema,
  setPasswordSchema,
  type ChangePasswordFormValues,
  type SetPasswordFormValues,
} from "@/src/shared/lib/validation/auth-schemas";
import { changePassword, setPassword } from "../services/accountService";
import { useErrorText } from "@/src/shared/lib/validation/useErrorText";

/** IDs of the first field in each form, focused when the form opens. */
export const CURRENT_PASSWORD_ID = "current-password";
export const NEW_PASSWORD_ID = "new-password";

const RULES_ID = "new-password-rules";

/** The checklist already lists what's missing, so the field's own error just points at it. */
const RULES_ERROR = "Choose a password that meets all the rules below.";

interface FormProps {
  /** Called once the password is saved. */
  onSaved: () => void;
  /** Cancel or Escape. */
  onCancel: () => void;
}

interface FormFrameProps {
  columns: "lg:grid-cols-2" | "lg:grid-cols-3";
  submitError: string | null;
  isSubmitting: boolean;
  submitLabel: string;
  busyLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  children: ReactNode;
}

/** The fields in a grid (side by side from 1024px), an error if saving failed, then Cancel and submit, right-aligned. */
function FormFrame({ columns, submitError, isSubmitting, submitLabel, busyLabel, onSubmit, onCancel, children }: FormFrameProps) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    onCancel();
  };

  return (
    <form onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate className="flex flex-col gap-4">
      <div className={`grid grid-cols-1 ${columns} items-start gap-4`}>{children}</div>
      {submitError && <InlineAlert variant="error">{submitError}</InlineAlert>}
      <div className="flex md:flex-row flex-col-reverse md:justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? busyLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/** "New password" with the live checklist under it. */
function NewPasswordField({ password, error, field }: { password: string; error?: string; field: UseFormRegisterReturn }) {
  return (
    <div className="flex flex-col gap-2">
      <PasswordInput
        id={NEW_PASSWORD_ID}
        label="New password"
        autoComplete="new-password"
        aria-describedby={RULES_ID}
        error={error}
        {...field}
      />
      <PasswordChecklist id={RULES_ID} password={password} />
    </div>
  );
}

/** Current, new (with the checklist) and confirm: three columns from 1024px. */
export function ChangePasswordForm({ onSaved, onCancel }: FormProps) {
  const errorText = useErrorText();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const newPassword = useWatch({ control, name: "newPassword" });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setSubmitError(null);
    try {
      await changePassword(values);
      onSaved();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <FormFrame
      columns="lg:grid-cols-3"
      submitError={submitError}
      isSubmitting={isSubmitting}
      submitLabel="Update password"
      busyLabel="Updating password…"
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
    >
      <PasswordInput
        id={CURRENT_PASSWORD_ID}
        label="Current password"
        autoComplete="current-password"
        error={errorText(errors.currentPassword?.message)}
        {...register("currentPassword")}
      />
      <NewPasswordField
        password={newPassword}
        error={errors.newPassword && RULES_ERROR}
        field={register("newPassword")}
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        error={errorText(errors.confirmPassword?.message)}
        {...register("confirmPassword")}
      />
    </FormFrame>
  );
}

/** For accounts that only log in with a provider: new (with the checklist) and confirm, two columns from 1024px. */
export function SetPasswordForm({ onSaved, onCancel }: FormProps) {
  const errorText = useErrorText();
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const onSubmit = async ({ newPassword }: SetPasswordFormValues) => {
    setSubmitError(null);
    try {
      await setPassword({ newPassword });
      onSaved();
    } catch (error) {
      setSubmitError(error instanceof Error && !isAxiosError(error) ? error.message : getErrorMessage(error));
    }
  };

  return (
    <FormFrame
      columns="lg:grid-cols-2"
      submitError={submitError}
      isSubmitting={isSubmitting}
      submitLabel="Set password"
      busyLabel="Setting password…"
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
    >
      <NewPasswordField
        password={newPassword}
        error={errors.newPassword && RULES_ERROR}
        field={register("newPassword")}
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        autoComplete="new-password"
        error={errorText(errors.confirmPassword?.message)}
        {...register("confirmPassword")}
      />
    </FormFrame>
  );
}
