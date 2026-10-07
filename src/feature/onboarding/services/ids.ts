const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Drafts saved by older builds can hold placeholder IDs ("0", "1"…) the API rejects. */
export function validId(id?: string): string | undefined {
  return id && UUID_RE.test(id) ? id : undefined;
}
