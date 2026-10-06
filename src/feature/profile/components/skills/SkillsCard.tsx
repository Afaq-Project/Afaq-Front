"use client";

import { ChipList } from "@/src/shared/ui/ChipList";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { useSkillGroups } from "../../hooks/useSkillGroups";
import { LabeledGroup } from "../common/LabeledGroup";
import { isLoadingName } from "../common/nameSkeleton";
import { SkillsEditor } from "./SkillsEditor";

interface SkillsCardProps {
  experiences: string[];
  names: ReferenceNames;
  isEditing: boolean;
  onEdit?: () => void;
  onDone: () => void;
}

export function SkillsCard({ experiences, names, isEditing, onEdit, onDone }: SkillsCardProps) {
  const groups = useSkillGroups(experiences, names);
  // Grouping needs the major list too, so show placeholders until it has loaded.
  const loading = experiences.some((value) => isLoadingName(names.skill(value)));

  if (isEditing) return <SkillsEditor experiences={experiences} names={names} onDone={onDone} />;

  return (
    <SectionCard title="Skills" onEdit={onEdit}>
      {experiences.length === 0 ? (
        <EmptyState message="Skills help us find opportunities that fit what you're good at." />
      ) : loading ? (
        <ChipList items={experiences.map((value) => ({ key: value, label: value }))} loading />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(({ category, skills }) => (
            <LabeledGroup key={category} label={category}>
              <ChipList items={skills} />
            </LabeledGroup>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
