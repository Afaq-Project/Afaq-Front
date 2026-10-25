import { BookOpen, Building2, GraduationCap, type LucideIcon } from "lucide-react";
import { ChipList, type ChipItem } from "@/src/shared/ui/ChipList";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { preferenceIdsFromApi } from "../../services/preferences";
import type { ApiPreferences } from "../../types/api";
import { toChipLabel } from "../common/displayFormat";
import { LabeledGroup } from "../common/LabeledGroup";
import { isLoadingName } from "../common/nameSkeleton";
import { StudyGoalsEditor } from "./StudyGoalsEditor";
import { useTranslations } from "next-intl";

interface StudyGoalsCardProps {
  preferences?: ApiPreferences;
  names: ReferenceNames;
  isEditing: boolean;
  onEdit?: () => void;
  onDone: () => void;
}

interface GoalGroup {
  label: string;
  icon: LucideIcon;
  items: ChipItem[];
  /** True while any of the names is still loading. */
  loading: boolean;
}

// TODO: a goals narrative belongs here once the profile API provides one.
export function StudyGoalsCard({ preferences, names, isEditing, onEdit, onDone }: StudyGoalsCardProps) {
  const t = useTranslations();
  if (isEditing) return <StudyGoalsEditor preferences={preferences} names={names} onDone={onDone} />;

  const ids = preferenceIdsFromApi(preferences);
  const chips = (list: string[], label: (id: string) => string) => list.map((id) => ({ key: id, label: label(id) }));

  const groups: GoalGroup[] = [
    {
      label: t("profile.goals.targetDegrees"),
      icon: GraduationCap,
      items: chips(ids.degrees, (id) => toChipLabel(names.educationLevel(id) ?? "")),
      loading: ids.degrees.some((id) => isLoadingName(names.educationLevel(id))),
    },
    {
      label: t("profile.goals.targetFields"),
      icon: BookOpen,
      items: chips(ids.majors, (id) => toChipLabel(names.major(id) ?? "")),
      loading: ids.majors.some((id) => isLoadingName(names.major(id))),
    },
    {
      label: t("profile.goals.targetInstitutions"),
      icon: Building2,
      // Institution names are proper nouns: only the trailing period is dropped, no sentence case.
      items: chips(ids.institutions, (id) =>
        (names.institution.exact(id) ?? t("profile.unresolvedInstitution")).trim().replace(/\.+$/, ""),
      ),
      // Institutions aren't looked up (no endpoint), so they never load.
      loading: false,
    },
  ];

  return (
    <SectionCard title={t("profile.goals.title")} onEdit={onEdit}>
      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <LabeledGroup key={group.label} label={group.label} icon={group.icon} count={group.items.length}>
            <ChipList items={group.items} loading={group.loading} emptyText={t("common.notAddedYet")} />
          </LabeledGroup>
        ))}
      </div>
    </SectionCard>
  );
}
