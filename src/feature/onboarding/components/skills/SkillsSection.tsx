"use client";

import { fromOptions, toOptions } from "../../services/selection";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { MAX_SKILLS, SkillPicker } from "@/src/shared/ui/pickers/SkillPicker";
import { useTranslations } from "next-intl";

interface SkillsSectionProps {
  skills: string[];
  skillIds: string[];
  onChange: (skills: string[], skillIds: string[]) => void;
}

/** The skills part of step 3: a heading with the selection count, and the skill picker. */
export function SkillsSection({ skills, skillIds, onChange }: SkillsSectionProps) {
  const t = useTranslations("onboarding.skills");
  const maxReached = skillIds.length >= MAX_SKILLS;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <StepSectionHeading>{t("skills")}</StepSectionHeading>
        <span className={`text-sm font-medium ${maxReached ? "text-warning font-bold" : "text-on-surface-variant"}`}>
          {t("skillsCount", { count: skillIds.length, max: MAX_SKILLS })}
        </span>
      </div>
      <SkillPicker
        selected={toOptions(skills, skillIds)}
        max={MAX_SKILLS}
        onChange={(next) => {
          const { names, ids } = fromOptions(next);
          onChange(names, ids);
        }}
      />
    </section>
  );
}
