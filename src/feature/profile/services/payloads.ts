import { DEFAULT_GPA_SCALE, type GpaScale } from "@/src/shared/lib/education";
import type { ApiEducation, CreateEducationPayload } from "../types/api";

/**
 * Keeps only the fields that have a value. The profile API leaves omitted fields unchanged,
 * so empty form fields are dropped rather than sent as "".
 */
export function nonEmptyFields<T extends Record<string, string>>(fields: T): Partial<T> {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value)) as Partial<T>;
}

/** Form state for adding or editing an education record (dates as YYYY-MM-DD). */
export interface EducationForm {
  educationLevelId: string;
  institutionId: string;
  majorId: string;
  minorMajorId: string;
  gpaRaw: string;
  gpaScale: GpaScale;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  expectedGraduationDate: string;
}

export function educationFormFrom(education: ApiEducation | null): EducationForm {
  return {
    educationLevelId: education?.educationLevelId ?? "",
    institutionId: education?.institutionId ?? "",
    majorId: education?.majorId ?? "",
    minorMajorId: education?.minorMajorId ?? "",
    gpaRaw: education?.gpaRaw?.toString() ?? "",
    gpaScale: (education?.gpaScale as GpaScale | undefined) ?? DEFAULT_GPA_SCALE,
    isCurrent: education?.isCurrent ?? false,
    startDate: education?.startDate?.slice(0, 10) ?? "",
    endDate: education?.endDate?.slice(0, 10) ?? "",
    expectedGraduationDate: education?.expectedGraduationDate?.slice(0, 10) ?? "",
  };
}

/** The create / update payload for an education form; only the relevant date is sent. */
export function educationPayloadFrom(form: EducationForm): CreateEducationPayload {
  return {
    ...nonEmptyFields({
      educationLevelId: form.educationLevelId,
      institutionId: form.institutionId,
      majorId: form.majorId,
      minorMajorId: form.minorMajorId,
      startDate: form.startDate,
    }),
    ...(form.gpaRaw && { gpaRaw: parseFloat(form.gpaRaw), gpaScale: form.gpaScale }),
    isCurrent: form.isCurrent,
    ...(!form.isCurrent && form.endDate && { endDate: form.endDate }),
    ...(form.isCurrent && form.expectedGraduationDate && { expectedGraduationDate: form.expectedGraduationDate }),
  };
}
