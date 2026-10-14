"use client";

import { useRef, useState } from "react";
import { profileService } from "@/src/feature/profile/services/profileService";
import { isReviewable } from "@/src/shared/lib/document-types";
import { notify } from "@/src/shared/lib/notify";
import { documentEdits } from "../services/documentEditsStore";
import { forgetReview, moveReview } from "../services/reviewStore";
import { DocumentDialog, type DialogKind } from "../components/library/DocumentDialogs";
import { TRACKED_APPLICATIONS } from "../services/utils";
import type { DocumentItem } from "../types/document";

interface Options {
  /** Refetches the document list after an upload or delete. */
  refresh: () => Promise<unknown>;
  /** After a replace: the new file's id (the API gives it a new document). */
  onReplaced?: (item: DocumentItem, newId: string) => void;
  onDeleted?: (item: DocumentItem) => void;
}

/**
 * Download and the ⋯ menu actions (rename, change type, replace, link, delete) for a document,
 * shared by the Documents list and the review page. Render `dialog` once.
 */
export function useDocumentActions({ refresh, onReplaced, onDeleted }: Options) {
  const [active, setActive] = useState<{ kind: DialogKind; item: DocumentItem } | null>(null);
  const [busy, setBusy] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = (kind: DialogKind, item: DocumentItem) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setActive({ kind, item });
  };
  const close = () => {
    setActive(null);
    returnFocus.current?.focus();
  };

  const download = async (item: DocumentItem) => {
    try {
      const { url } = await profileService.getDocumentDownloadUrl(item.id);
      window.open(url, "_blank", "noopener");
    } catch {
      notify.error("We couldn't download that file", "Try again in a moment.");
    }
  };

  const run = {
    rename: (name: string) => {
      // TODO: no rename endpoint; the new name is local.
      documentEdits.rename(active!.item.id, name);
      close();
    },
    type: (type: Parameters<typeof documentEdits.setType>[1]) => {
      // TODO: no endpoint to change a document's type; the change is local.
      documentEdits.setType(active!.item.id, type);
      close();
    },
    replace: async (file: File) => {
      const item = active!.item;
      if (!item.apiTypeId) return notify.error("This document has no type to upload under");
      setBusy(true);
      try {
        // No replace endpoint: upload the new file under the same type, then delete the old one.
        const created = await profileService.uploadDocument(item.apiTypeId, file);
        await profileService.deleteDocument(item.id);
        documentEdits.move(item.id, created.id);
        if (isReviewable(item.type)) moveReview(item.id, created.id);
        await refresh();
        setActive(null);
        if (onReplaced) onReplaced(item, created.id);
        else notify.success("File replaced");
      } catch {
        notify.error("We couldn't replace that file", "Check your connection and try again.");
      } finally {
        setBusy(false);
      }
    },
    link: (applicationIds: string[]) => {
      // TODO: no endpoint links documents to applications; links are local.
      documentEdits.setLinks(active!.item.id, applicationIds);
      close();
    },
    remove: async () => {
      const item = active!.item;
      setBusy(true);
      try {
        await profileService.deleteDocument(item.id);
        forgetReview(item.id);
        notify.success("Document deleted");
        await refresh();
        setActive(null);
        onDeleted?.(item);
      } catch {
        notify.error("We couldn't delete that document", "Try again in a moment.");
      } finally {
        setBusy(false);
      }
    },
  };

  const dialog = (
    <DocumentDialog
      kind={active?.kind ?? null}
      item={active?.item ?? null}
      applications={TRACKED_APPLICATIONS}
      busy={busy}
      onClose={close}
      onRename={run.rename}
      onChangeType={run.type}
      onReplace={run.replace}
      onLink={run.link}
      onDelete={run.remove}
    />
  );

  return { open, download, dialog };
}
