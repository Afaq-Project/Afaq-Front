import type { PersonalInfoData } from "../../types";
import { FieldLabel } from "@/src/shared/ui/FieldLabel";
import { INPUT_CLASS } from "../common/formStyles";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { useTranslations } from "next-intl";

interface NameSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function NameSection({ data, onChange }: NameSectionProps) {
  const t = useTranslations("onboarding.personal");
  return (
    <section className="flex flex-col gap-5">
      <StepSectionHeading>{t("name")}</StepSectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-first-name" required>{t("firstName")}</FieldLabel>
          <input
            id="onb-first-name"
            type="text"
            value={data.firstName ?? ""}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            placeholder={t("firstNamePlaceholder")}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-last-name" required>{t("lastName")}</FieldLabel>
          <input
            id="onb-last-name"
            type="text"
            value={data.lastName ?? ""}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            placeholder={t("lastNamePlaceholder")}
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </section>
  );
}
