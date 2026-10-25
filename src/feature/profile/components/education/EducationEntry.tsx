import { GraduationCap } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import { EditButton } from "@/src/shared/ui/EditButton";
import { EntryItem } from "@/src/shared/ui/EntryItem";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatGpa } from "../../services/format";
import type { ApiEducation } from "../../types/api";
import { useProfileFormat } from "../common/displayFormat";
import { withNameSkeleton } from "../common/nameSkeleton";
import { useTranslations } from "next-intl";

interface EducationEntryProps {
  education: ApiEducation;
  names: ReferenceNames;
  /** Opens this record's form. Undefined while another card edits. */
  onEdit?: () => void;
}

/** One degree: icon tile, degree name, institution, date range, GPA as a metric, then field of study and minor. */
export function EducationEntry({ education, names, onEdit }: EducationEntryProps) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const format = useProfileFormat();
  const institution =
    names.institution.exact(education.institutionId) ??
    (education.institutionId ? t("unresolvedInstitution") : undefined);
  const dates = format.dateRange(
    education.startDate,
    education.isCurrent ? education.expectedGraduationDate : education.endDate,
    education.isCurrent && !education.expectedGraduationDate,
  );
  const gpa = formatGpa(education.gpaRaw, education.gpaScale);
  const major = names.major(education.majorId);
  const minor = names.major(education.minorMajorId);

  return (
    <EntryItem
      icon={GraduationCap}
      title={names.educationLevel.exact(education.educationLevelId) ?? t("education.entryFallback")}
      titleAddon={education.isCurrent ? <Badge tone="blue">{t("education.currentlyEnrolled")}</Badge> : undefined}
      metric={
        gpa && (
          <div className="text-end">
            <p className="text-caption text-neutral-600">{t("education.gpa")}</p>
            <p className="text-h2 text-neutral-900">{gpa}</p>
            {/* TODO: show the 4.0-scale equivalent here once the API provides it. */}
          </div>
        )
      }
      actions={onEdit && <EditButton onClick={onEdit} label={t("education.editRecord")} />}
      details={
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <div className="min-w-0">
            <dt className="text-caption text-neutral-600">{t("education.fieldOfStudy")}</dt>
            <dd className="text-body text-neutral-900">{major ? withNameSkeleton(major) : <span className="text-neutral-400">{tc("notAddedYet")}</span>}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-caption text-neutral-600">{t("education.minor")}</dt>
            <dd className="text-body text-neutral-900">{minor ? withNameSkeleton(minor) : <span className="text-neutral-400">{tc("notAddedYet")}</span>}</dd>
          </div>
        </dl>
      }
    >
      {institution && <p className="text-body text-neutral-900">{institution}</p>}
      {dates && <p className="text-small text-neutral-600">{dates}</p>}
    </EntryItem>
  );
}
