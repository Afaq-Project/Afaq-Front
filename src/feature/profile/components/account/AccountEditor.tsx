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

interface AccountEditorProps {
  profile?: ApiProfile;
  email?: string;
  onDone: () => void;
}

export function AccountEditor({ profile, email, onDone }: AccountEditorProps) {
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
      title="Account details"
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate(nonEmptyFields(form), { onSuccess: savedThen("Account details saved", onDone) })}
      isSaving={updateMut.isPending}
      error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id={FIELD_IDS.firstName} label="First name" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
        <Input id={FIELD_IDS.lastName} label="Last name" value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
        <FieldGrid>
          <Field label="Email" value={email} />
        </FieldGrid>
        <Input id={FIELD_IDS.phone} label="Phone" type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
      </div>
      <p className="mt-2 text-small text-neutral-600">Your sign-in email can&apos;t be changed here.</p>
    </SectionCard>
  );
}
