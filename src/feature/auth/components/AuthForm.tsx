import type { FormEventHandler, ReactNode } from "react";
import Button from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import SocialAuthButtons from "./SocialAuthButtons";
import TextLink from "./TextLink";

interface AuthFormProps {
  title: string;
  subtitle: string;
  /** Optional info banner above the form (e.g. session expired). */
  notice?: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** Field inputs — the only part that differs between login and sign-up. */
  children: ReactNode;
  /** Optional line directly above the submit button (e.g. consent). */
  beforeSubmit?: ReactNode;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  /** Form-level error; rendered under the submit button and linked via aria-describedby. */
  error?: ReactNode;
  errorId: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
}

/**
 * Shared shell for the login and sign-up forms: heading, notice, fields, submit,
 * error, social buttons and the switch link — same structure and spacing on both pages.
 */
export default function AuthForm({
  title,
  subtitle,
  notice,
  onSubmit,
  children,
  beforeSubmit,
  submitLabel,
  submittingLabel,
  isSubmitting,
  error,
  errorId,
  switchPrompt,
  switchLabel,
  switchHref,
}: AuthFormProps) {
  return (
    <>
      <h1 className="text-h1 text-neutral-900">{title}</h1>
      <p className="mt-1 text-body text-neutral-600">{subtitle}</p>

      {notice && (
        <InlineAlert variant="info" className="mt-8 short:mt-4">
          {notice}
        </InlineAlert>
      )}

      <form
        className="flex flex-col gap-5 short:gap-3 mt-8 short:mt-4"
        onSubmit={onSubmit}
        aria-describedby={error ? errorId : undefined}
        noValidate
      >
        {children}

        {beforeSubmit && (
          <p className="text-neutral-600 text-small">{beforeSubmit}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="rounded-md! w-full">
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>

        {error && (
          <InlineAlert variant="error" id={errorId}>
            {error}
          </InlineAlert>
        )}
      </form>

      <SocialAuthButtons />

      <p className="mt-8 short:mt-4 text-neutral-600 text-small text-center">
        {switchPrompt} <TextLink href={switchHref}>{switchLabel}</TextLink>
      </p>
    </>
  );
}
