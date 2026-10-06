export function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : undefined;
}

/** "PREFER_NOT_TO_SAY" / "male" → "Prefer not to say" / "Male" */
export function formatEnum(value?: string | null) {
  if (!value) return undefined;
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** 3.8 / 4 · 4.5 / 5 · 88.5% */
export function formatGpa(raw?: number | null, scale?: string | null) {
  if (raw == null) return undefined;
  if (scale === "OUT_OF_100") return `${raw}%`;
  return scale ? `${raw} ${scale.replace("OUT_OF_", "/ ")}` : `${raw}`;
}

/** Some reference names arrive in ALL CAPS with a trailing period ("AGRICULTURAL SCIENCES."). */
export function formatReferenceName(name: string) {
  const trimmed = name.replace(/\.$/, "");
  return trimmed === trimmed.toUpperCase() ? trimmed.charAt(0) + trimmed.slice(1).toLowerCase() : trimmed;
}

/** Shown for institutions, which can't be looked up by ID yet (see useReferenceNames). */
export const UNRESOLVED_INSTITUTION_NAME = "Name not available yet";

export function fullName(firstName?: string | null, lastName?: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}
