import { useTranslations } from "next-intl";

/** Bios shorter than this also get the note on how the bio is used. */
const SHORT_BIO_LENGTH = 20;

/** Full-width "About you" text (≈65ch lines), with a note on its use when it's empty or very short. */
export function AboutYouBlock({ bio }: { bio?: string | null }) {
  const t = useTranslations("profile.background");
  const tc = useTranslations("common");
  const text = bio?.trim() ?? "";

  return (
    <div className="max-w-prose">
      <h4 className="text-caption text-neutral-600">{t("aboutYou")}</h4>
      <p className={`mt-1 whitespace-pre-line text-body ${text ? "text-neutral-900" : "text-neutral-400"}`}>
        {text || tc("notAddedYet")}
      </p>
      {text.length < SHORT_BIO_LENGTH && (
        <p className="text-caption font-normal text-neutral-600">{t("aboutYouNote")}</p>
      )}
    </div>
  );
}
