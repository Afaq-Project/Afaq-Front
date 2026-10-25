"use client";

import { useState } from "react";
import Button from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import Input from "@/src/shared/ui/Input";
import { requestAccountDeletion } from "../services/accountService";
import { ConfirmDialog } from "./ConfirmDialog";
import { SettingsRow } from "./SettingsSection";
import { useTranslations } from "next-intl";

const CONFIRM_WORD = "DELETE";

/** Last row of "Privacy and support": a destructive request, confirmed by typing DELETE. */
export function DeleteAccountRow({ email }: { email: string }) {
  const t = useTranslations("settings.privacy");
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  // TODO: local only; read a pending deletion request from the API once it exists.
  const [requested, setRequested] = useState(false);

  const close = () => {
    setConfirming(false);
    setTyped("");
  };

  return (
    <>
      <SettingsRow
        label={t("delete")}
        // TODO: confirm the 30-day timeframe with the backend team.
        help={t("deleteHelp")}
        after={
          requested && (
            <InlineAlert variant="info" className="mt-3">
              {t("deleteSent", { email })}
            </InlineAlert>
          )
        }
      >
        <Button type="button" variant="destructive" disabled={requested} onClick={() => setConfirming(true)}>
          {requested ? t("deleteRequested") : t("requestDelete")}
        </Button>
      </SettingsRow>

      <ConfirmDialog
        open={confirming}
        title={t("deleteTitle")}
        onClose={close}
        onConfirm={async () => {
          await requestAccountDeletion();
          setRequested(true);
          close();
        }}
        confirmLabel={t("requestDelete")}
        busyLabel={t("sending")}
        confirmVariant="destructive"
        confirmDisabled={typed !== CONFIRM_WORD}
      >
        <p>
          {t("deleteBody")}
        </p>
        <p>{t("deleteWhen")}</p>
        <Input
          id="delete-confirm"
          label={t("typeToConfirm", { word: CONFIRM_WORD })}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
      </ConfirmDialog>
    </>
  );
}
