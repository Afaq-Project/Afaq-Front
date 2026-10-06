import type { Option } from "../types";

// The draft stores multi-selections as parallel name/ID arrays (kept for compatibility with
// saved drafts); the form components work with Option lists. These convert between the two.

export function toOptions(names: string[] = [], ids: string[] = []): Option[] {
  return ids.map((id, i) => ({ id, name: names[i] ?? "" }));
}

export function fromOptions(options: Option[]): { names: string[]; ids: string[] } {
  return { names: options.map((o) => o.name), ids: options.map((o) => o.id) };
}
