import { Pencil } from "lucide-react";
import Button from "./Button";

interface EditButtonProps {
  onClick: () => void;
  /** Accessible name, e.g. "Edit background". */
  label: string;
}

/** Low-emphasis edit control: ghost style, pencil + "Edit". Always visible. */
export function EditButton({ onClick, label }: EditButtonProps) {
  return (
    <Button type="button" variant="ghost" onClick={onClick} aria-label={label} className="px-2">
      <Pencil size={16} strokeWidth={1.75} aria-hidden="true" />
      Edit
    </Button>
  );
}
