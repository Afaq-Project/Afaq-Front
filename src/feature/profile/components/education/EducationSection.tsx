"use client";

import { AddValueButton } from "@/src/shared/ui/AddValueButton";
import Badge from "@/src/shared/ui/Badge";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiEducation } from "../../types/api";
import { editHandler, type EditingState } from "../common/editing";
import { REQUIRED_FOR_MATCHING } from "../common/fieldIds";
import { withNameSkeleton } from "../common/nameSkeleton";
import { ProfilePageSection } from "../common/ProfilePageSection";
import { CurrentLevelForm } from "./CurrentLevelForm";
import { EducationEntry } from "./EducationEntry";
import { EducationRecordForm } from "./EducationRecordForm";

const LEVEL = "education-level";
const NEW_RECORD = "education:new";
const recordKey = (id: string) => `education:${id}`;

interface EducationSectionProps {
  levelId?: string | null;
  educations: ApiEducation[];
  names: ReferenceNames;
  edit: EditingState;
}

/**
 * One card: the profile's current education level (what the card's Edit changes), then each
 * degree as an entry with its own Edit — field of study lives on the entry it belongs to.
 */
export function EducationSection({ levelId, educations, names, edit }: EducationSectionProps) {
  const addRecord = editHandler(edit, NEW_RECORD);

  return (
    <ProfilePageSection id="education" title="Education">
      <SectionCard
        title="Education"
        titleAddon={<Badge tone="gray">Used for matching</Badge>}
        onEdit={editHandler(edit, LEVEL)}
      >
        {edit.editing === LEVEL ? (
          <CurrentLevelForm levelId={levelId} onDone={edit.stop} />
        ) : (
          <FieldGrid>
            <Field
              label="Current education level"
              info={REQUIRED_FOR_MATCHING}
              value={withNameSkeleton(names.educationLevel(levelId))}
            />
          </FieldGrid>
        )}

        <hr className="my-5 border-neutral-100" />

        <div className="flex flex-col gap-6">
          {educations.map((education) =>
            edit.editing === recordKey(education.id) ? (
              <EducationRecordForm
                key={education.id}
                education={education}
                names={names}
                onDone={edit.stop}
              />
            ) : (
              <EducationEntry
                key={education.id}
                education={education}
                names={names}
                onEdit={editHandler(edit, recordKey(education.id))}
              />
            ),
          )}

          {edit.editing === NEW_RECORD ? (
            <EducationRecordForm education={null} names={names} onDone={edit.stop} />
          ) : (
            addRecord && (
              <div>
                <AddValueButton
                  label={educations.length === 0 ? "Add your first education record" : "Add another education record"}
                  onClick={addRecord}
                />
              </div>
            )
          )}
        </div>
      </SectionCard>
    </ProfilePageSection>
  );
}
