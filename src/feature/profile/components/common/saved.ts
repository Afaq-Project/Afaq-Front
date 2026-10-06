import { notify } from "@/src/shared/lib/notify";

/**
 * Success handler for a profile save: confirms with a toast, then closes the editor.
 * Failures stay inline in the form, next to the fields they're about.
 */
export function savedThen(message: string, onDone: () => void) {
  return () => {
    notify.success(message);
    onDone();
  };
}
