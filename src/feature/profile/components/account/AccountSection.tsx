import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ApiProfile } from "../../types/api";
import { editHandler, type EditingState } from "../common/editing";
import { ProfilePageSection } from "../common/ProfilePageSection";
import { AccountEditor } from "./AccountEditor";
import { useTranslations } from "next-intl";

interface AccountSectionProps {
  profile?: ApiProfile;
  /** Fallback when the profile has no email yet. */
  accountEmail?: string;
  edit: EditingState;
}

export function AccountSection({ profile, accountEmail, edit }: AccountSectionProps) {
  const t = useTranslations("profile.account");
  const email = profile?.email ?? accountEmail;

  return (
    <ProfilePageSection id="account" title={t("title")}>
      {edit.editing === "account" ? (
        <AccountEditor profile={profile} email={email} onDone={edit.stop} />
      ) : (
        <SectionCard title={t("details")} onEdit={editHandler(edit, "account")}>
          <FieldGrid>
            <Field label={t("firstName")} value={profile?.firstName} />
            <Field label={t("lastName")} value={profile?.lastName} />
            <Field label={t("email")} value={email} />
            <Field label={t("phone")} value={profile?.phone} />
          </FieldGrid>
        </SectionCard>
      )}

      <SectionCard title={t("passwordTitle")}>
        {/* TODO: show the password status and connected providers here once the profile exposes them. */}
        <p className="mb-3 text-body text-neutral-600">{t("passwordBody")}</p>
        <Link
          href="/settings"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-medium text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-0"
        >
          {t("goToSettings")}
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </SectionCard>
    </ProfilePageSection>
  );
}
