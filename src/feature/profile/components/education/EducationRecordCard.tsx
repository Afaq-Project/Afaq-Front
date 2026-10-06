import Badge from "@/src/shared/ui/Badge";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatDate, formatGpa } from "../../services/format";
import type { ApiEducation } from "../../types/api";
import { Field, FieldGrid } from "../common/Field";

interface EducationRecordCardProps {
  education: ApiEducation;
  names: ReferenceNames;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export function EducationRecordCard({ education, names, onEdit, onDelete, deleting }: EducationRecordCardProps) {
  // Institution names can't be looked up by ID yet (see useReferenceNames), so a saved
  // institution may have no name to show.
  const institutionName =
    names.institution.exact(education.institutionId) ??
    (education.institutionId ? "Not available yet" : undefined);

  return (
    <div className="relative border border-neutral-100 rounded-xl p-4">
      <div className="absolute top-3 right-3 flex items-center gap-0.5">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit education"
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label="Delete education"
          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>

      <div className="pr-16">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <p className="text-sm font-semibold text-neutral-900">
            {names.educationLevel(education.educationLevelId) ?? "Education"}
          </p>
          {education.isCurrent && <Badge tone="green">Currently enrolled</Badge>}
        </div>
        <FieldGrid>
          <Field label="Institution" value={institutionName} />
          <Field label="GPA" value={formatGpa(education.gpaRaw, education.gpaScale)} />
          <Field label="Major" value={names.major(education.majorId)} />
          <Field label="Minor" value={names.major(education.minorMajorId)} />
          <Field label="Start Date" value={formatDate(education.startDate)} />
          {education.isCurrent ? (
            <Field label="Expected Graduation" value={formatDate(education.expectedGraduationDate)} />
          ) : (
            <Field label="End Date" value={formatDate(education.endDate)} />
          )}
        </FieldGrid>
      </div>
    </div>
  );
}
