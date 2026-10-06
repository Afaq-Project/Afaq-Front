import type { PersonalInfoData } from "../../types";
import { FieldLabel } from "@/src/shared/ui/FieldLabel";
import { INPUT_CLASS } from "../common/formStyles";
import { StepSectionHeading } from "../common/StepSectionHeading";

interface NameSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function NameSection({ data, onChange }: NameSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <StepSectionHeading>Name</StepSectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-first-name" required>First Name</FieldLabel>
          <input
            id="onb-first-name"
            type="text"
            value={data.firstName ?? ""}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            placeholder="Enter your first name"
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-last-name" required>Last Name</FieldLabel>
          <input
            id="onb-last-name"
            type="text"
            value={data.lastName ?? ""}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            placeholder="Enter your last name"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </section>
  );
}
