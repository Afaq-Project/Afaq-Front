"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { SUPPORT_EMAIL, requestDataExport } from "../services/accountService";
import { ConfirmDialog } from "./ConfirmDialog";
import { DeleteAccountRow } from "./DeleteAccountRow";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import { useTranslations } from "next-intl";

/** Data export, support, and account deletion (last) in one card. */
export function PrivacySupportSection({ email }: { email: string }) {
  const t = useTranslations("settings");
  const [confirmingExport, setConfirmingExport] = useState(false);
  // TODO: local only, so a reload allows another request; read pending requests from the API once it exists.
  const [exportRequested, setExportRequested] = useState(false);

  return (
    <SettingsSection
      id="privacy-support"
      title={t("sections.privacy-support")}
      description={t("privacy.description")}
    >
      <SettingsRow
        label={t("privacy.download")}
        help={t("privacy.downloadHelp")}
        after={
          exportRequested && (
            <InlineAlert variant="success" className="mt-3">
              {t("privacy.exportSent", { email })}
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
          {exportRequested ? t("privacy.exportRequested") : t("privacy.requestExport")}
        </Button>
      </SettingsRow>

      <ConfirmDialog
        open={confirmingExport}
        title={t("privacy.exportTitle")}
        onClose={() => setConfirmingExport(false)}
        onConfirm={async () => {
          await requestDataExport();
          setExportRequested(true);
          setConfirmingExport(false);
        }}
        confirmLabel={t("privacy.requestExport")}
        busyLabel={t("privacy.sending")}
      >
        <p>
          {t.rich("privacy.exportBody", {
            email,
            strong: (chunks) => <span className="font-medium text-neutral-900 break-all">{chunks}</span>,
          })}
        </p>
      </ConfirmDialog>

      <SettingsRow label={t("privacy.questions")} help={t("privacy.questionsHelp")}>
        <a href={`mailto:${SUPPORT_EMAIL}`} className={buttonClasses("ghost")}>
          <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
          {t("privacy.contact")}
        </a>
      </SettingsRow>

      <DeleteAccountRow email={email} />
    </SettingsSection>
  );
}
