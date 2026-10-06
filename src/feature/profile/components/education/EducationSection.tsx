"use client";

import { useDeleteEducation } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiEducation } from "../../types/api";
import { EmptyState } from "../common/EmptyState";
import { Field } from "../common/Field";
import { ProfileSection } from "../common/ProfileSection";
import { EducationRecordCard } from "./EducationRecordCard";

interface EducationSectionProps {
  currentLevelId?: string | null;
  educations: ApiEducation[];
  names: ReferenceNames;
  onAdd: () => void;
  onEdit: (education: ApiEducation) => void;
}

export function EducationSection({ currentLevelId, educations, names, onAdd, onEdit }: EducationSectionProps) {
  const deleteEducation = useDeleteEducation();

  return (
    <ProfileSection icon="school" title="Education" onAdd={onAdd}>
      <div className="mb-6">
        <Field label="Current Education Level" value={names.educationLevel(currentLevelId)} />
      </div>

      {educations.length === 0 ? (
        <EmptyState
          message="No education records yet."
          actionLabel="Add your first education record"
          onAction={onAdd}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {educations.map((education) => (
            <EducationRecordCard
              key={education.id}
              education={education}
              names={names}
              onEdit={() => onEdit(education)}
              onDelete={() => deleteEducation.mutate(education.id)}
              deleting={deleteEducation.isPending}
            />
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
