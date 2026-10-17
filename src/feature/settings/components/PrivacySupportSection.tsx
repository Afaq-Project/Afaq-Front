"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { SUPPORT_EMAIL, requestDataExport } from "../services/accountService";
import { ConfirmDialog } from "./ConfirmDialog";
import { DeleteAccountRow } from "./DeleteAccountRow";
import { SettingsRow, SettingsSection } from "./SettingsSection";

/** Data export, support, and account deletion (last) in one card. */
export function PrivacySupportSection({ email }: { email: string }) {
  const [confirmingExport, setConfirmingExport] = useState(false);
  // TODO: local only, so a reload allows another request; read pending requests from the API once it exists.
  const [exportRequested, setExportRequested] = useState(false);

  return (
    <SettingsSection
      id="privacy-support"
      title="Privacy and support"
      description="We collect only what's needed to match you with opportunities."
    >
      <SettingsRow
        label="Download your data"
        help="We'll email you a copy of your data within 7 days."
        after={
          exportRequested && (
            <InlineAlert variant="success" className="mt-3">
              Request sent. We&apos;ll email {email}.
            </InlineAlert>
          )
        }
      >
        <Button
          type="button"
          variant="secondary"
          disabled={exportRequested}
          onClick={() => setConfirmingExport(true)}
        >
          {exportRequested ? "Export requested" : "Request export"}
        </Button>
      </SettingsRow>

      <ConfirmDialog
        open={confirmingExport}
        title="Request a copy of your data?"
        onClose={() => setConfirmingExport(false)}
        onConfirm={async () => {
          await requestDataExport();
          setExportRequested(true);
          setConfirmingExport(false);
        }}
        confirmLabel="Request export"
        busyLabel="Sending request…"
      >
        <p>
          We&apos;ll email a copy of your profile, documents, and applications to{" "}
          <span className="font-medium text-neutral-900 break-all">{email}</span> within 7 days.
        </p>
      </ConfirmDialog>

      <SettingsRow label="Questions about your account?" help="Email our support team.">
        <a href={`mailto:${SUPPORT_EMAIL}`} className={buttonClasses("ghost")}>
          <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
          Contact support
        </a>
      </SettingsRow>

      <DeleteAccountRow email={email} />
    </SettingsSection>
  );
}
