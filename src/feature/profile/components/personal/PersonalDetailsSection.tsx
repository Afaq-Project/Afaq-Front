import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatDate, formatEnum } from "../../services/format";
import type { ApiProfile } from "../../types/api";
import { Field, FieldGrid } from "../common/Field";
import { ProfileSection } from "../common/ProfileSection";

interface PersonalDetailsSectionProps {
  profile?: ApiProfile;
  names: ReferenceNames;
  onEdit: () => void;
}

export function PersonalDetailsSection({ profile, names, onEdit }: PersonalDetailsSectionProps) {
  return (
    <ProfileSection icon="person" title="Personal Details" onEdit={onEdit}>
      <FieldGrid>
        <Field label="First Name" value={profile?.firstName} />
        <Field label="Last Name" value={profile?.lastName} />
        <Field label="Email" value={profile?.email} />
        <Field label="Phone" value={profile?.phone} />
        <Field label="Date of Birth" value={formatDate(profile?.dateOfBirth)} />
        <Field label="Gender" value={formatEnum(profile?.gender)} />
        <Field label="Nationality" value={names.nationality(profile?.nationalityId)} />
        <Field label="Current Country" value={names.country(profile?.countryOfResidenceId)} />
        <Field label="Current City" value={names.city(profile?.currentCityId)} />
        <Field label="Marital Status" value={names.maritalStatus(profile?.maritalStatusId)} />
      </FieldGrid>
      {profile?.bio && (
        <div className="mt-5">
          <p className="text-xs text-neutral-400 mb-0.5">Bio</p>
          <p className="text-sm text-neutral-900">{profile.bio}</p>
        </div>
      )}
    </ProfileSection>
  );
}
