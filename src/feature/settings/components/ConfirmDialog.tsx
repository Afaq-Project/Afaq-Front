"use client";

import { useState, type ReactNode } from "react";
import Button, { type ButtonVariant } from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import Modal from "@/src/shared/ui/Modal";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Runs the action; the dialog shows `busyLabel` meanwhile and any error inline. */
  onConfirm: () => Promise<void>;
  confirmLabel: string;
  busyLabel: string;
  confirmVariant?: ButtonVariant;
  /** E.g. until "DELETE" is typed. */
  confirmDisabled?: boolean;
  children: ReactNode;
}

/** A Modal with Cancel and a confirm button. Cancel comes first, so it takes focus on open. */
export function ConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel,
  busyLabel,
  confirmVariant = "secondary",
  confirmDisabled = false,
  children,
}: ConfirmDialogProps) {
  const tc = useTranslations("common");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (busy) return;
    setError(null);
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title={title} className="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!confirmDisabled && !busy) confirm();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-3 text-body text-neutral-800">{children}</div>
        {error && <InlineAlert variant="error">{error}</InlineAlert>}
        <div className="flex sm:flex-row flex-col-reverse sm:justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close} disabled={busy}>
            {tc("cancel")}
          </Button>
          <Button type="submit" variant={confirmVariant} disabled={confirmDisabled || busy}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
