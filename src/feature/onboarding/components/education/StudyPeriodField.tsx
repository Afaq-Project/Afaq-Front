import type { EducationData } from "../../types";
import { FieldLabel } from "@/src/shared/ui/FieldLabel";
import { useTranslations } from "next-intl";

const DATE_INPUT_CLASS =
  "bg-white px-4 py-3 border rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 w-full text-on-surface text-sm transition-all";

interface StudyPeriodFieldProps {
  education: EducationData;
  invalid: boolean;
  onChange: (education: EducationData) => void;
}

/** Start date plus either end date or expected graduation, depending on "currently studying". */
export function StudyPeriodField({ education, invalid, onChange }: StudyPeriodFieldProps) {
  const t = useTranslations("onboarding.education");
  const { isCurrent } = education;

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel optional>{t("studyPeriod")}</FieldLabel>

      <label className="flex items-center gap-3 w-fit cursor-pointer">
        <div
          onClick={() =>
            onChange({
              ...education,
              isCurrent: !isCurrent,
              endDate: isCurrent ? education.endDate : "",
            })
          }
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isCurrent ? "bg-primary" : "bg-neutral-300"}`}
        >
          <span
            className={`absolute top-0.5 start-0 w-5 h-5 bg-white rounded-full shadow transition-transform ${isCurrent ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0.5 rtl:-translate-x-0.5"}`}
          />
        </div>
        <span className="text-on-surface text-sm">{t("currentlyStudying")}</span>
      </label>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="onb-start-date" className="font-medium text-on-surface-variant text-xs">
            {t("startDate")}
          </label>
          <input
            id="onb-start-date"
            type="date"
            value={education.startDate ?? ""}
            onChange={(e) => onChange({ ...education, startDate: e.target.value })}
            className={DATE_INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="onb-end-date" className="font-medium text-on-surface-variant text-xs">
            {isCurrent ? t("expectedGraduation") : t("endDate")}
          </label>
          <input
            id="onb-end-date"
            type="date"
            value={(isCurrent ? education.expectedGraduationDate : education.endDate) ?? ""}
            min={education.startDate || undefined}
            aria-invalid={invalid}
            onChange={(e) =>
              onChange(
                isCurrent
                  ? { ...education, expectedGraduationDate: e.target.value }
                  : { ...education, endDate: e.target.value },
              )
            }
            className={DATE_INPUT_CLASS}
          />
        </div>
      </div>

      {invalid && (
        <p className="text-xs text-error">
          {isCurrent ? t("graduationBeforeStart") : t("endBeforeStart")}
        </p>
      )}
    </div>
  );
}
