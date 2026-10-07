import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ApiProfile } from "../../types/api";
import { editHandler, type EditingState } from "../common/editing";
import { ProfilePageSection } from "../common/ProfilePageSection";
import { AccountEditor } from "./AccountEditor";

interface AccountSectionProps {
  profile?: ApiProfile;
  /** Fallback when the profile has no email yet. */
  accountEmail?: string;
  edit: EditingState;
}

export function AccountSection({ profile, accountEmail, edit }: AccountSectionProps) {
  const email = profile?.email ?? accountEmail;

  return (
    <ProfilePageSection id="account" title="Account">
      {edit.editing === "account" ? (
        <AccountEditor profile={profile} email={email} onDone={edit.stop} />
      ) : (
        <SectionCard title="Account details" onEdit={editHandler(edit, "account")}>
          <FieldGrid>
            <Field label="First name" value={profile?.firstName} />
            <Field label="Last name" value={profile?.lastName} />
            <Field label="Email" value={email} />
            <Field label="Phone" value={profile?.phone} />
          </FieldGrid>
        </SectionCard>
      )}

      <SectionCard title="Password and sign-in">
        {/* TODO: show the password status and connected providers here once the profile exposes them. */}
        <p className="mb-3 text-body text-neutral-600">Change your password and manage connected accounts in settings.</p>
        <Link
          href="/settings"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-medium text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-0"
        >
          Go to settings
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </SectionCard>
    </ProfilePageSection>
  );
}
