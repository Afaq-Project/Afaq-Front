import { toast } from "sonner";

/**
 * App notifications. Components call these instead of the toast library directly, so the
 * library can change in one place. Copy: sentence case, no trailing punctuation
 * ("Background saved").
 */
export const notify = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  info: (message: string, description?: string) => toast.info(message, { description }),
};
