"use client";

import { useState } from "react";
import Button from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import Input from "@/src/shared/ui/Input";
import { requestAccountDeletion } from "../services/accountService";
import { ConfirmDialog } from "./ConfirmDialog";
import { SettingsRow } from "./SettingsSection";

const CONFIRM_WORD = "DELETE";

/** Last row of "Privacy and support": a destructive request, confirmed by typing DELETE. */
export function DeleteAccountRow({ email }: { email: string }) {
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
        label="Delete account"
        // TODO: confirm the 30-day timeframe with the backend team.
        help="Permanently delete your account and data. This can't be undone. We'll process your request within 30 days."
        after={
          requested && (
            <InlineAlert variant="info" className="mt-3">
              Request sent. We&apos;ll email {email} when your account has been deleted.
            </InlineAlert>
          )
        }
      >
        <Button type="button" variant="destructive" disabled={requested} onClick={() => setConfirming(true)}>
          {requested ? "Deletion requested" : "Request account deletion"}
        </Button>
      </SettingsRow>

      <ConfirmDialog
        open={confirming}
        title="Delete your account?"
        onClose={close}
        onConfirm={async () => {
          await requestAccountDeletion();
          setRequested(true);
          close();
        }}
        confirmLabel="Request account deletion"
        busyLabel="Sending request…"
        confirmVariant="destructive"
        confirmDisabled={typed !== CONFIRM_WORD}
      >
        <p>
          This permanently deletes your profile, documents, applications, saved opportunities, and AI chats. If you
          have an active subscription, it will be cancelled.
        </p>
        <p>We&apos;ll process your request within 30 days. This can&apos;t be undone.</p>
        <Input
          id="delete-confirm"
          label={`Type ${CONFIRM_WORD} to confirm`}
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
