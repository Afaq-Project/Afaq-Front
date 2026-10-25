import {
  File,
  FileUser,
  GraduationCap,
  IdCard,
  Languages,
  Mail,
  PenLine,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

/** The one document type list. It's the only basis for matching documents to requirements. */
export type DocumentTypeKey = "cv" | "transcript" | "degree" | "recommendation" | "essay" | "id" | "language" | "other";

export const DOCUMENT_TYPES: { key: DocumentTypeKey; label: string; icon: LucideIcon }[] = [
  { key: "cv", label: "CV / resume", icon: FileUser },
  { key: "transcript", label: "Transcript", icon: ScrollText },
  { key: "degree", label: "Degree certificate", icon: GraduationCap },
  { key: "recommendation", label: "Recommendation letter", icon: Mail },
  { key: "essay", label: "Personal statement / essay", icon: PenLine },
  { key: "id", label: "Passport / ID", icon: IdCard },
  { key: "language", label: "Language certificate", icon: Languages },
  { key: "other", label: "Other", icon: File },
];

export const documentType = (key: DocumentTypeKey) => DOCUMENT_TYPES.find((type) => type.key === key)!;

// Whole-word patterns for reading the API's type names ("Academic Transcript", "IELTS
// Certificate"...). Order matters: language before degree, since both can say "certificate".
const NAME_PATTERNS: [DocumentTypeKey, RegExp][] = [
  ["cv", /\b(cv|resume|résumé|curriculum vitae)\b/i],
  ["transcript", /\btranscripts?\b/i],
  ["language", /\b(language|ielts|toefl|english proficiency)\b/i],
  ["degree", /\b(degree|diploma|graduation)\b/i],
  ["recommendation", /\b(recommendation|reference letter)\b/i],
  ["essay", /\b(essay|statement|motivation letter)\b/i],
  ["id", /\b(passport|national id|id card|identity)\b/i],
  ["other", /\bother\b/i],
];

/**
 * Our type for an API document type name, or undefined when the name names none of them.
 * Never guesses: an unrecognized name stays untyped.
 */
export function typeForName(typeName: string): DocumentTypeKey | undefined {
  return NAME_PATTERNS.find(([, pattern]) => pattern.test(typeName))?.[0];
}

/** Document types the AI can review: essays, CVs and recommendation letters. */
export const REVIEWABLE_TYPES: DocumentTypeKey[] = ["essay", "cv", "recommendation"];

export const isReviewable = (type?: DocumentTypeKey): type is DocumentTypeKey =>
  Boolean(type && REVIEWABLE_TYPES.includes(type));

/** How review copy names a reviewable document; messages pick the words with {noun, select, ...}. */
export type ReviewNoun = "cv" | "recommendation" | "essay";

/** The review noun for a document type ("Get AI feedback on this CV"). */
export function reviewNoun(type?: DocumentTypeKey): ReviewNoun {
  if (type === "cv" || type === "recommendation") return type;
  return "essay";
}
