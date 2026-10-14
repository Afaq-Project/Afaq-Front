"use client";

import { useSyncExternalStore } from "react";
import type { DocumentTypeKey } from "@/src/shared/lib/document-types";

/**
 * TODO: renaming, changing type and linking to applications have no endpoints yet, so they're
 * kept here in memory, shared by the Documents list and the review page, and reset on reload.
 */
export interface LocalEdits {
  names: Record<string, string>;
  types: Record<string, DocumentTypeKey>;
  links: Record<string, string[]>;
}

const EMPTY: LocalEdits = { names: {}, types: {}, links: {} };

let edits = EMPTY;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDocumentEdits() {
  return useSyncExternalStore(
    subscribe,
    () => edits,
    () => EMPTY,
  );
}

function update(next: (prev: LocalEdits) => LocalEdits) {
  edits = next(edits);
  listeners.forEach((listener) => listener());
}

export const documentEdits = {
  rename: (id: string, name: string) => update((prev) => ({ ...prev, names: { ...prev.names, [id]: name } })),
  setType: (id: string, type: DocumentTypeKey) => update((prev) => ({ ...prev, types: { ...prev.types, [id]: type } })),
  setLinks: (id: string, applicationIds: string[]) =>
    update((prev) => ({ ...prev, links: { ...prev.links, [id]: applicationIds } })),
  /** Carries links and a changed type over to a replacement file's new id. */
  move: (oldId: string, newId: string) =>
    update((prev) => ({
      ...prev,
      links: { ...prev.links, [newId]: prev.links[oldId] ?? [] },
      types: prev.types[oldId] ? { ...prev.types, [newId]: prev.types[oldId] } : prev.types,
    })),
};
