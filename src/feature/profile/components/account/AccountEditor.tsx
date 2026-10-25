"use client";

import { useState } from "react";
import { useAutoFocus } from "@/src/shared/hooks/useAutoFocus";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import Input from "@/src/shared/ui/Input";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import { nonEmptyFields } from "../../services/payloads";
import type { ApiProfile } from "../../types/api";
import { FIELD_IDS } from "../common/fieldIds";
import { savedThen } from "../common/saved";
import { useTranslations } from "next-intl";

interface AccountEditorProps {
  profile?: ApiProfile;
  email?: string;
  onDone: () => void;
}

export function AccountEditor({ profile, email, onDone }: AccountEditorProps) {
  const t = useTranslations("profile.account");
  const updateMut = useUpdatePersonal();
  useAutoFocus(FIELD_IDS.firstName);
  const [form, setForm] = useState({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    phone: profile?.phone ?? "",
  });
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <SectionCard
      title={t("details")}
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate(nonEmptyFields(form), { onSuccess: savedThen(t("saved"), onDone) })}
      isSaving={updateMut.isPending}
      error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id={FIELD_IDS.firstName} label={t("firstName")} value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
        <Input id={FIELD_IDS.lastName} label={t("lastName")} value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
        <FieldGrid>
          <Field label={t("email")} value={email} />
        </FieldGrid>
        <Input id={FIELD_IDS.phone} label={t("phone")} type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
      </div>
      <p className="mt-2 text-small text-neutral-600">{t("emailFixed")}</p>
    </SectionCard>
  );
}
