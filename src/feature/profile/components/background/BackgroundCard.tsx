import { Flag, MapPin } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import { Field, FieldGrid } from "@/src/shared/ui/FieldGrid";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatEnum } from "../../services/format";
import type { ApiProfile } from "../../types/api";
import { formatBirthDate } from "../common/displayFormat";
import { REQUIRED_FOR_MATCHING } from "../common/fieldIds";
import { AboutYouBlock } from "./AboutYouBlock";
import { BackgroundEditor } from "./BackgroundEditor";

interface BackgroundCardProps {
  profile?: ApiProfile;
  names: ReferenceNames;
  isEditing: boolean;
  onEdit?: () => void;
  onDone: () => void;
}

// TODO: work experience and financial need belong here once the profile API provides them.
export function BackgroundCard({ profile, names, isEditing, onEdit, onDone }: BackgroundCardProps) {
  if (isEditing) return <BackgroundEditor profile={profile} names={names} onDone={onDone} />;

  // "{city}, {country}", or whichever of the two is set.
  const location = [names.city(profile?.currentCityId), names.country(profile?.countryOfResidenceId)]
    .filter(Boolean)
    .join(", ");

  return (
    <SectionCard title="Background" titleAddon={<Badge tone="gray">Used for matching</Badge>} onEdit={onEdit}>
      {/* Used for matching */}
      <dl>
        <Field label="Nationality" info={REQUIRED_FOR_MATCHING} icon={Flag} value={names.nationality(profile?.nationalityId)} />
      </dl>

      <hr className="my-5 border-neutral-100" />

      {/* Personal details */}
      <FieldGrid>
        <Field label="Location" icon={MapPin} value={location} />
        <Field label="Date of birth" value={formatBirthDate(profile?.dateOfBirth)} />
        <Field label="Gender" value={formatEnum(profile?.gender)} />
        <Field label="Marital status" value={names.maritalStatus(profile?.maritalStatusId)} />
      </FieldGrid>

      <hr className="my-5 border-neutral-100" />

      <AboutYouBlock bio={profile?.bio} />
    </SectionCard>
  );
}
