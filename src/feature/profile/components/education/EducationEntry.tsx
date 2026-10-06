import { GraduationCap } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import { EditButton } from "@/src/shared/ui/EditButton";
import { EntryItem } from "@/src/shared/ui/EntryItem";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatGpa, UNRESOLVED_INSTITUTION_NAME } from "../../services/format";
import type { ApiEducation } from "../../types/api";
import { formatDateRange } from "../common/displayFormat";

interface EducationEntryProps {
  education: ApiEducation;
  names: ReferenceNames;
  /** Opens this record's form. Undefined while another card edits. */
  onEdit?: () => void;
}

/** One degree: icon tile, degree name, institution, date range, and the GPA as a metric. */
export function EducationEntry({ education, names, onEdit }: EducationEntryProps) {
  const institution =
    names.institution.exact(education.institutionId) ??
    (education.institutionId ? UNRESOLVED_INSTITUTION_NAME : undefined);
  const dates = formatDateRange(
    education.startDate,
    education.isCurrent ? education.expectedGraduationDate : education.endDate,
    education.isCurrent && !education.expectedGraduationDate,
  );
  const gpa = formatGpa(education.gpaRaw, education.gpaScale);
  const minor = names.major(education.minorMajorId);

  return (
    <EntryItem
      icon={GraduationCap}
      title={names.educationLevel(education.educationLevelId) ?? "Education"}
      titleAddon={education.isCurrent ? <Badge tone="blue">Currently enrolled</Badge> : undefined}
      metric={
        gpa && (
          <div className="text-right">
            <p className="text-caption text-neutral-600">GPA</p>
            <p className="text-h2 text-neutral-900">{gpa}</p>
            {/* TODO: show the 4.0-scale equivalent here once the API provides it. */}
          </div>
        )
      }
      actions={onEdit && <EditButton onClick={onEdit} label="Edit this education record" revealOn="entry" />}
      details={
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <div className="min-w-0">
            <dt className="text-caption text-neutral-600">Minor</dt>
            <dd className="text-body text-neutral-900">{minor ?? <span className="text-neutral-400">Not added yet</span>}</dd>
          </div>
        </dl>
      }
    >
      {institution && <p className="text-body text-neutral-900">{institution}</p>}
      {dates && <p className="text-small text-neutral-600">{dates}</p>}
    </EntryItem>
  );
}
