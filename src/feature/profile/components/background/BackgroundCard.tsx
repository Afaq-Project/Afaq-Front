import { Flag, MapPin } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatEnum } from "../../services/format";
import type { ApiProfile } from "../../types/api";
import { useProfileFormat } from "../common/displayFormat";
import { isLoadingName, withNameSkeleton } from "../common/nameSkeleton";
import { AboutYouBlock } from "./AboutYouBlock";
import { BackgroundEditor } from "./BackgroundEditor";
import { useTranslations } from "next-intl";
import type messages from "@/src/messages/en.json";

interface BackgroundCardProps {
  profile?: ApiProfile;
  names: ReferenceNames;
  isEditing: boolean;
  onEdit?: () => void;
  onDone: () => void;
}

type Gender = keyof (typeof messages)["onboarding"]["personal"]["genders"];

// TODO: work experience and financial need belong here once the profile API provides them.
export function BackgroundCard({ profile, names, isEditing, onEdit, onDone }: BackgroundCardProps) {
  const t = useTranslations();
  const format = useProfileFormat();
  if (isEditing) return <BackgroundEditor profile={profile} names={names} onDone={onDone} />;

  // "{city}, {country}", or whichever of the two is set.
  const locationParts = [names.city(profile?.currentCityId), names.country(profile?.countryOfResidenceId)];
  const location = locationParts.some(isLoadingName)
    ? withNameSkeleton(locationParts.find(isLoadingName), "w-40")
    : locationParts.filter(Boolean).join(", ");

  return (
    <SectionCard title={t("profile.background.title")} titleAddon={<Badge tone="gray">{t("profile.usedForMatching")}</Badge>} onEdit={onEdit}>
      {/* Used for matching */}
      <dl>
        <Field label={t("profile.background.nationality")} info={t("profile.requiredForMatching")} icon={Flag} value={withNameSkeleton(names.nationality(profile?.nationalityId))} />
      </dl>

      <hr className="my-5 border-neutral-100" />

      {/* Personal details */}
      <FieldGrid>
        <Field label={t("profile.background.location")} icon={MapPin} value={location} />
        <Field label={t("profile.background.dateOfBirth")} value={format.birthDate(profile?.dateOfBirth)} />
        <Field label={t("profile.background.gender")} value={profile?.gender && (t.has(`onboarding.personal.genders.${profile.gender as Gender}`) ? t(`onboarding.personal.genders.${profile.gender as Gender}`) : formatEnum(profile.gender))} />
        <Field label={t("profile.background.maritalStatus")} value={withNameSkeleton(names.maritalStatus(profile?.maritalStatusId))} />
      </FieldGrid>

      <hr className="my-5 border-neutral-100" />

      <AboutYouBlock bio={profile?.bio} />
    </SectionCard>
  );
}
