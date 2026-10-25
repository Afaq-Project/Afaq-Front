import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/src/shared/ui/LanguageToggle";

/**
 * Compact logo + wordmark used on the auth pages, with the language switch at the other end
 * (there's no Settings before signing in).
 */
export default function AuthBrand({ className = "" }: { className?: string }) {
  const t = useTranslations("shell");

  return (
    <div className={`flex justify-between items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Image src="/afaq.png" alt="" width={32} height={32} priority />
        <span className="font-semibold text-primary-800 text-h2">{t("brand")}</span>
      </div>
      <LanguageToggle className="-me-2" />
    </div>
  );
}
