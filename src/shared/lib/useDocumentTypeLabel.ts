import { useTranslations } from "next-intl";
import type { DocumentTypeKey } from "./document-types";

/** A document type's name in the app's language; untyped documents read as "Other". */
export function useDocumentTypeLabel() {
  const t = useTranslations("documentTypes");
  return (type?: DocumentTypeKey) => t(type ?? "other");
}
