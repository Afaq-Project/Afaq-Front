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

export function fullName(firstName?: string | null, lastName?: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}
