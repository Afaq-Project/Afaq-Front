"use client";

import { useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useLanguagesSearch, useProficiencyLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import type { ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Modal from "@/src/shared/ui/Modal";
import Select from "@/src/shared/ui/Select";
import { useAddLanguage } from "../../hooks/useProfileQuery";
import { ModalActions } from "../common/ModalActions";

interface AddLanguageModalProps {
  /** Languages the profile already has — they can't be added twice. */
  existingLanguageIds: string[];
  onClose: () => void;
}

export function AddLanguageModal({ existingLanguageIds, onClose }: AddLanguageModalProps) {
  const addMut = useAddLanguage();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data: rawLanguages = [], isFetching } = useLanguagesSearch(debouncedQuery);
  const languages: ReferenceOption[] = rawLanguages
    .filter((l) => !existingLanguageIds.includes(l.id))
    .map((l) => ({ id: l.id, name: l.nameEn }));
  const { data: levels = [] } = useProficiencyLevels();

  const [form, setForm] = useState({ languageId: "", languageName: "", proficiencyLevelId: "", isNative: false });
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const canSave = Boolean(form.languageId && form.proficiencyLevelId);

  const handleSave = () => {
    if (!canSave) return;
    addMut.mutate(
      { languageId: form.languageId, proficiencyLevelId: form.proficiencyLevelId, isNative: form.isNative },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal open onClose={onClose} title="Add Language">
      <div className="flex flex-col gap-4">
        <InlineSearch<ReferenceOption>
          label="Language"
          selectedName={form.languageName}
          items={languages}
          isFetching={isFetching}
          onSearch={setQuery}
          onSelect={(item) => set({ languageId: item.id, languageName: item.name })}
          onClear={() => set({ languageId: "", languageName: "" })}
          minSearchLength={0}
        />
        <Select
          id="lang-level"
          label="Proficiency Level"
          value={form.proficiencyLevelId}
          onChange={(e) => set({ proficiencyLevelId: e.target.value })}
          options={[{ value: "", label: "Select level" }, ...levels.map((l) => ({ value: l.id, label: l.nameEn }))]}
        />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isNative}
            onChange={(e) => set({ isNative: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-neutral-700">Native language</span>
        </label>
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={addMut.isPending}
          saveLabel="Add language"
          saveDisabled={!canSave}
          error={addMut.isError ? getErrorMessage(addMut.error) : null}
        />
      </div>
    </Modal>
  );
}
