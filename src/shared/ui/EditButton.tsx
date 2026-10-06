import { Pencil } from "lucide-react";
import Button from "./Button";

// Static class names (Tailwind can't build them dynamically). On pointer devices the button is
// hidden until its card / entry is hovered or has focus; on touch devices it's always shown.
// It stays keyboard-reachable either way, and becomes visible when focused.
const REVEAL = {
  card: "pointer-fine:opacity-0 pointer-fine:group-hover/card:opacity-100 pointer-fine:group-focus-within/card:opacity-100",
  entry: "pointer-fine:opacity-0 pointer-fine:group-hover/entry:opacity-100 pointer-fine:group-focus-within/entry:opacity-100",
} as const;

interface EditButtonProps {
  onClick: () => void;
  /** Accessible name, e.g. "Edit background". */
  label: string;
  /** Which hover group reveals the button: a SectionCard (`card`) or an EntryItem (`entry`). */
  revealOn?: keyof typeof REVEAL;
}

/** Low-emphasis edit control: ghost style, pencil + "Edit". */
export function EditButton({ onClick, label, revealOn = "card" }: EditButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-label={label}
      className={`px-2 transition-opacity focus-visible:opacity-100 ${REVEAL[revealOn]}`}
    >
      <Pencil size={16} strokeWidth={1.75} aria-hidden="true" />
      Edit
    </Button>
  );
}
