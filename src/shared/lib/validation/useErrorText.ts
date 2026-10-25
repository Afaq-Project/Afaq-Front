import { useTranslations } from "next-intl";
import type messages from "@/src/messages/en.json";

export type ValidationKey = keyof (typeof messages)["validation"];

const PREFIX = "validation.";

/** A form schema's error message: the key of a validation message, translated when shown. */
export const validationMessage = (key: ValidationKey) => `${PREFIX}${key}`;

/** Translates a form error that holds a validation message key; anything else (a server message) shows as is. */
export function useErrorText() {
  const t = useTranslations("validation");
  return (error?: string) => {
    if (!error?.startsWith(PREFIX)) return error;
    const key = error.slice(PREFIX.length) as ValidationKey;
    return t.has(key) ? t(key) : error;
  };
}
