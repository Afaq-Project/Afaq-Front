"use client";

import { useState } from "react";
import { MAX_SKILLS, SkillPicker } from "@/src/shared/ui/pickers/SkillPicker";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import type { ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import Modal from "@/src/shared/ui/Modal";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { ModalActions } from "../common/ModalActions";

interface EditSkillsModalProps {
  experiences: string[];
  names: ReferenceNames;
  onClose: () => void;
}

/** Edits the profile's skills (`experiences`, saved as a whole list). */
export function EditSkillsModal({ experiences, names, onClose }: EditSkillsModalProps) {
  const updateMut = useUpdatePersonal();
  const [selected, setSelected] = useState<ReferenceOption[]>(() =>
    experiences.map((value) => ({ id: value, name: names.skill(value) ?? value })),
  );

  const ids = selected.map((s) => s.id);
  const unchanged = ids.length === experiences.length && ids.every((id, i) => id === experiences[i]);

  return (
    <Modal open onClose={onClose} title="Edit Skills & Experience" className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500">
          {selected.length} of {MAX_SKILLS} selected
        </p>
        <SkillPicker selected={selected} onChange={setSelected} max={MAX_SKILLS} />
        <ModalActions
          onCancel={onClose}
          onSave={() => updateMut.mutate({ experiences: ids }, { onSuccess: onClose })}
          isPending={updateMut.isPending}
          saveDisabled={unchanged}
          error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
        />
      </div>
    </Modal>
  );
}
