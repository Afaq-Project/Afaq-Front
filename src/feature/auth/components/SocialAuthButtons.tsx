import Button from "@/src/shared/ui/Button";
import { GoogleIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";
import { useTranslations } from "next-intl";

// TODO: no OAuth handlers exist yet — wire onClick to the Google/LinkedIn flows when available.
export default function SocialAuthButtons() {
  const t = useTranslations("auth");

  return (
    <div>
      <div className="flex items-center gap-3 my-8 short:my-4">
        <div className="flex-1 border-neutral-100 border-t" />
        <span className="text-caption text-neutral-600">{t("orContinueWith")}</span>
        <div className="flex-1 border-neutral-100 border-t" />
      </div>

      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        <Button type="button" variant="secondary" className="rounded-md! w-full">
          <GoogleIcon className="w-5 h-5" />
          Google
        </Button>
        <Button type="button" variant="secondary" className="rounded-md! w-full">
          <LinkedInIcon className="w-4 h-4 text-brand-linkedin" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
