"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import Button from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { PROVIDER_NAMES, type LoginMethods, type Provider } from "../services/accountService";
import { CURRENT_PASSWORD_ID, ChangePasswordForm, NEW_PASSWORD_ID, SetPasswordForm } from "./PasswordForms";
import { SettingsRow, SettingsSection } from "./SettingsSection";

/** Anchor for the password row; the connected-accounts lockout note links here. */
export const PASSWORD_ROW_ID = "account-password";

const PASSWORD_FORM_ID = "account-password-form";

interface AccountSectionProps {
  email: string;
  loginMethods: LoginMethods;
  onPasswordSet: () => void;
  /** Whether the password form is expanded; lifted so the lockout note can open it too. */
  passwordFormOpen: boolean;
  onPasswordFormOpenChange: (open: boolean) => void;
}

export function AccountSection({
  email,
  loginMethods,
  onPasswordSet,
  passwordFormOpen: open,
  onPasswordFormOpenChange: setOpen,
}: AccountSectionProps) {
  const [saved, setSaved] = useState<string | null>(null);
  // Bumped to remount the form, which clears its fields and errors.
  const [formKey, setFormKey] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { hasPassword } = loginMethods;
  const providerNames = (Object.keys(loginMethods.providers) as Provider[]).map((p) => PROVIDER_NAMES[p]);

  // Focus the first field once the form opens (it's inert until then).
  useEffect(() => {
    if (!open) return;
    document.getElementById(hasPassword ? CURRENT_PASSWORD_ID : NEW_PASSWORD_ID)?.focus({ preventScroll: true });
  }, [open, hasPassword]);

  const close = () => {
    setOpen(false);
    setFormKey((key) => key + 1);
    toggleRef.current?.focus();
  };

  const onSaved = () => {
    setSaved(hasPassword ? "Your password was updated." : "Your password was set. You can now log in with your email.");
    if (!hasPassword) onPasswordSet();
    close();
  };

  return (
    <SettingsSection id="account" title="Account">
      <SettingsRow label="Email">
        <div className="md:text-right">
          <p className="text-body text-neutral-900 break-all">{email || "—"}</p>
          <p className="text-caption text-neutral-600">Used for login and reminders</p>
        </div>
      </SettingsRow>

      <SettingsRow
        id={PASSWORD_ROW_ID}
        // TODO: show "Last changed {relative date}" once /auth/me reports when the password changed.
        label={hasPassword ? "Password" : "No password set"}
        help={hasPassword ? "Change the password you use to log in" : `You log in with ${providerNames.join(" and ")}`}
        after={
          <>
            {/* Always mounted so it can animate closed; inert (out of tab order and the a11y tree) while collapsed. */}
            <div
              id={PASSWORD_FORM_ID}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              {/* The negative margin keeps focus rings from being clipped. */}
              <div className="-m-1 p-1 min-h-0 overflow-hidden">
                <div className="pt-4">
                  {hasPassword ? (
                    <ChangePasswordForm key={formKey} onSaved={onSaved} onCancel={close} />
                  ) : (
                    <SetPasswordForm key={formKey} onSaved={onSaved} onCancel={close} />
                  )}
                </div>
              </div>
            </div>
            {saved && !open && (
              <InlineAlert variant="success" className="mt-3">
                {saved}
              </InlineAlert>
            )}
          </>
        }
      >
        <Button
          ref={toggleRef}
          type="button"
          variant="secondary"
          aria-expanded={open}
          aria-controls={PASSWORD_FORM_ID}
          onClick={() => {
            setSaved(null);
            if (open) close();
            else setOpen(true);
          }}
        >
          {hasPassword ? "Change password" : "Set a password"}
        </Button>
      </SettingsRow>
    </SettingsSection>
  );
}
