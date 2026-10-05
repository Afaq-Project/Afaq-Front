"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import {
  useProfileQuery,
  useUpdatePersonal,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
  useAddLanguage,
  useDeleteLanguage,
  useUploadDocument,
  useDeleteDocument,
} from "@/src/feature/profile/hooks/useProfileQuery";
import Modal from "@/src/shared/ui/Modal";
import Input from "@/src/shared/ui/Input";
import Select from "@/src/shared/ui/Select";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import type { ApiProfile, ApiEducation } from "@/src/feature/profile/types/api";
import {
  useEducationLevels,
  useCountriesSearch,
  useCitiesForCountry,
  useLanguagesSearch,
  useProficiencyLevels,
  useDocumentTypes,
  useInstitutionsSearch,
  useMajorsSearch,
  useMaritalStatuses,
} from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "education" | "background" | "documents";

// ─── Static ───────────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "education", label: "Education", icon: "school" },
  { id: "background", label: "Background & Skills", icon: "psychology" },
  { id: "documents", label: "Documents", icon: "folder_open" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const GPA_SCALE_OPTIONS = [
  { value: "OUT_OF_4", label: "/ 4.0" },
  { value: "OUT_OF_5", label: "/ 5.0" },
  { value: "PERCENTAGE", label: "%" },
  { value: "LETTER_GRADE", label: "Letter" },
];

function fmtGpa(raw?: number | null, scale?: string | null) {
  if (raw == null) return undefined;
  const suffix = scale
    ? ` (${scale.replace("OUT_OF_", "/ ").replace("PERCENTAGE", "%").replace("LETTER_GRADE", "Letter")})`
    : "";
  return `${raw}${suffix}`;
}

// ─── Display helpers ──────────────────────────────────────────────────────────
function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">{children}</div>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-neutral-900">{value || "—"}</p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  onEdit,
  onAdd,
}: {
  icon: string;
  title: string;
  onEdit?: () => void;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <span
          className="material-symbols-outlined text-xl text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        )}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add to ${title}`}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        )}
      </div>
    </div>
  );
}

function DocIcon({ mimeType }: { mimeType?: string }) {
  const isPdf = mimeType?.includes("pdf");
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isPdf ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
      }`}
    >
      <span className="material-symbols-outlined text-lg">
        {isPdf ? "picture_as_pdf" : "description"}
      </span>
    </div>
  );
}

function ModalActions({
  onCancel,
  onSave,
  isPending,
  saveLabel = "Save changes",
}: {
  onCancel: () => void;
  onSave: () => void;
  isPending: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isPending}
        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
      >
        {isPending ? "Saving…" : saveLabel}
      </button>
    </div>
  );
}

// ─── Modal: Edit Personal Details ─────────────────────────────────────────────
function EditPersonalModal({
  open,
  onClose,
  profile,
  resolvedNationalityName,
  resolvedCountryName,
  resolvedCityName,
}: {
  open: boolean;
  onClose: () => void;
  profile?: ApiProfile | null;
  resolvedNationalityName?: string;
  resolvedCountryName?: string;
  resolvedCityName?: string;
}) {
  const updateMut = useUpdatePersonal();
  const { data: rawMarital = [] } = useMaritalStatuses();
  const maritalOptions = [
    { value: "", label: "Select status" },
    ...rawMarital.map((m) => ({ value: m.id, label: m.nameEn })),
  ];

  const [countryQ, setCountryQ] = useState("");
  const [natQ, setNatQ] = useState("");
  const dCountryQ = useDebounce(countryQ, 300);
  const dNatQ = useDebounce(natQ, 300);

  const { data: rawCountries = [], isFetching: fetchingCountries } = useCountriesSearch(dCountryQ);
  const countries = rawCountries.map((c) => ({ id: c.id, name: c.nameEn }));

  const { data: rawNats = [], isFetching: fetchingNats } = useCountriesSearch(dNatQ);
  const nationalities = rawNats.map((c) => ({ id: c.id, name: c.nationalityNameEn ?? c.nameEn }));

  const [form, setForm] = useState({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    dateOfBirth: profile?.dateOfBirth?.slice(0, 10) ?? "",
    phone: profile?.phone ?? "",
    gender: profile?.gender ?? "",
    maritalStatusId: profile?.maritalStatusId ?? "",
    nationalityId: profile?.nationalityId ?? "",
    nationalityName: resolvedNationalityName ?? "",
    countryOfResidenceId: profile?.countryOfResidenceId ?? "",
    countryOfResidenceName: resolvedCountryName ?? "",
    currentCityId: profile?.currentCityId ?? "",
    currentCityName: resolvedCityName ?? "",
    bio: profile?.bio ?? "",
  });

  const { data: rawCities = [], isLoading: loadingCities } = useCitiesForCountry(
    form.countryOfResidenceId,
  );
  const cities = rawCities.map((c) => ({ id: c.id, name: c.nameEn }));

  const handleSave = async () => {
    await updateMut.mutateAsync({
      ...(form.firstName && { firstName: form.firstName }),
      ...(form.lastName && { lastName: form.lastName }),
      ...(form.dateOfBirth && { dateOfBirth: form.dateOfBirth }),
      ...(form.phone && { phone: form.phone }),
      ...(form.gender && { gender: form.gender }),
      ...(form.maritalStatusId && { maritalStatusId: form.maritalStatusId }),
      ...(form.nationalityId && { nationalityId: form.nationalityId }),
      ...(form.countryOfResidenceId && { countryOfResidenceId: form.countryOfResidenceId }),
      ...(form.currentCityId && { currentCityId: form.currentCityId }),
      ...(form.bio && { bio: form.bio }),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Personal Details">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="p-fname"
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
          />
          <Input
            id="p-lname"
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="p-dob"
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
          />
          <Input
            id="p-phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="p-gender"
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
            options={GENDER_OPTIONS}
          />
          <Select
            id="p-marital"
            label="Marital Status"
            value={form.maritalStatusId}
            onChange={(e) => setForm((p) => ({ ...p, maritalStatusId: e.target.value }))}
            options={maritalOptions}
          />
        </div>
        <InlineSearch
          label="Nationality"
          hint="optional"
          selectedName={form.nationalityName}
          items={nationalities}
          isFetching={fetchingNats}
          onSearch={setNatQ}
          onSelect={(item) =>
            setForm((p) => ({ ...p, nationalityId: item.id, nationalityName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, nationalityId: "", nationalityName: "" }))}
          minSearchLength={0}
        />
        <InlineSearch
          label="Country of Residence"
          hint="optional"
          selectedName={form.countryOfResidenceName}
          items={countries}
          isFetching={fetchingCountries}
          onSearch={setCountryQ}
          onSelect={(item) =>
            setForm((p) => ({
              ...p,
              countryOfResidenceId: item.id,
              countryOfResidenceName: item.name,
              currentCityId: "",
              currentCityName: "",
            }))
          }
          onClear={() =>
            setForm((p) => ({
              ...p,
              countryOfResidenceId: "",
              countryOfResidenceName: "",
              currentCityId: "",
              currentCityName: "",
            }))
          }
          minSearchLength={0}
        />
        <InlineSearch
          label="City"
          hint="optional"
          selectedName={form.currentCityName}
          items={cities}
          isFetching={loadingCities}
          onSearch={() => {}}
          onSelect={(item) =>
            setForm((p) => ({ ...p, currentCityId: item.id, currentCityName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, currentCityId: "", currentCityName: "" }))}
          filterLocally
          disabled={!form.countryOfResidenceId}
          minSearchLength={1}
          placeholder="Search city…"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-bio" className="font-medium text-neutral-800 text-xs">
            Bio
          </label>
          <textarea
            id="p-bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            className="px-3 py-2 rounded-sm border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
          />
        </div>
        {updateMut.isError && (
          <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
        )}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={updateMut.isPending}
        />
      </div>
    </Modal>
  );
}

// ─── Modal: Add / Edit Education ──────────────────────────────────────────────
function EditEduModal({
  open,
  onClose,
  education,
}: {
  open: boolean;
  onClose: () => void;
  education: ApiEducation | null;
}) {
  const createMut = useCreateEducation();
  const updateMut = useUpdateEducation();
  const isEdit = education !== null;

  const { data: rawLevels = [] } = useEducationLevels();
  const levelOptions = [
    { value: "", label: "Select level" },
    ...rawLevels.map((l) => ({ value: l.id, label: l.nameEn })),
  ];

  const [instQ, setInstQ] = useState("");
  const [majorQ, setMajorQ] = useState("");
  const [minorQ, setMinorQ] = useState("");
  const dInstQ = useDebounce(instQ, 300);
  const dMajorQ = useDebounce(majorQ, 300);
  const dMinorQ = useDebounce(minorQ, 300);

  const { data: rawInsts = [], isFetching: fetchingInsts } = useInstitutionsSearch(dInstQ);
  const institutions = rawInsts.map((i) => ({ id: i.id, name: i.nameEn }));

  const { data: rawMajors = [], isFetching: fetchingMajors } = useMajorsSearch(dMajorQ);
  const majors = rawMajors.map((m) => ({ id: m.id, name: m.nameEn }));

  const { data: rawMinors = [], isFetching: fetchingMinors } = useMajorsSearch(dMinorQ);
  const minors = rawMinors.map((m) => ({ id: m.id, name: m.nameEn }));

  const [form, setForm] = useState({
    educationLevelId: education?.educationLevelId ?? "",
    institutionId: education?.institutionId ?? "",
    institutionName: "",
    majorId: education?.majorId ?? "",
    majorName: "",
    minorMajorId: education?.minorMajorId ?? "",
    minorMajorName: "",
    gpaRaw: education?.gpaRaw?.toString() ?? "",
    gpaScale: education?.gpaScale ?? "OUT_OF_4",
    isCurrent: education?.isCurrent ?? false,
    startDate: education?.startDate?.slice(0, 10) ?? "",
    endDate: education?.endDate?.slice(0, 10) ?? "",
    expectedGraduationDate: education?.expectedGraduationDate?.slice(0, 10) ?? "",
  });

  const handleSave = async () => {
    const payload = {
      ...(form.educationLevelId && { educationLevelId: form.educationLevelId }),
      ...(form.institutionId && { institutionId: form.institutionId }),
      ...(form.majorId && { majorId: form.majorId }),
      ...(form.minorMajorId && { minorMajorId: form.minorMajorId }),
      ...(form.gpaRaw && { gpaRaw: parseFloat(form.gpaRaw), gpaScale: form.gpaScale }),
      isCurrent: form.isCurrent,
      ...(form.startDate && { startDate: form.startDate }),
      ...(!form.isCurrent && form.endDate && { endDate: form.endDate }),
      ...(form.isCurrent && form.expectedGraduationDate && {
        expectedGraduationDate: form.expectedGraduationDate,
      }),
    };

    if (isEdit) {
      await updateMut.mutateAsync({ id: education.id, data: payload });
    } else {
      await createMut.mutateAsync(payload);
    }
    onClose();
  };

  const isPending = createMut.isPending || updateMut.isPending;
  const isError = createMut.isError || updateMut.isError;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Education" : "Add Education"}>
      <div className="flex flex-col gap-4">
        <Select
          id="edu-level"
          label="Education Level"
          value={form.educationLevelId}
          onChange={(e) => setForm((p) => ({ ...p, educationLevelId: e.target.value }))}
          options={levelOptions}
        />
        <InlineSearch
          label="Institution"
          hint="optional"
          selectedName={form.institutionName}
          items={institutions}
          isFetching={fetchingInsts}
          onSearch={setInstQ}
          onSelect={(item) =>
            setForm((p) => ({ ...p, institutionId: item.id, institutionName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, institutionId: "", institutionName: "" }))}
          minSearchLength={2}
          placeholder="Type to search institution…"
        />
        <InlineSearch
          label="Field of Study"
          hint="optional"
          selectedName={form.majorName}
          items={majors}
          isFetching={fetchingMajors}
          onSearch={setMajorQ}
          onSelect={(item) =>
            setForm((p) => ({ ...p, majorId: item.id, majorName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, majorId: "", majorName: "" }))}
          minSearchLength={2}
          placeholder="Type to search major…"
        />
        <InlineSearch
          label="Minor / Secondary Field"
          hint="optional"
          selectedName={form.minorMajorName}
          items={minors}
          isFetching={fetchingMinors}
          onSearch={setMinorQ}
          onSelect={(item) =>
            setForm((p) => ({ ...p, minorMajorId: item.id, minorMajorName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, minorMajorId: "", minorMajorName: "" }))}
          minSearchLength={2}
          placeholder="Type to search minor…"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edu-gpa"
            label="GPA / Grade"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={form.gpaRaw}
            onChange={(e) => setForm((p) => ({ ...p, gpaRaw: e.target.value }))}
          />
          <Select
            id="edu-scale"
            label="Scale"
            value={form.gpaScale}
            onChange={(e) => setForm((p) => ({ ...p, gpaScale: e.target.value }))}
            options={GPA_SCALE_OPTIONS}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => setForm((p) => ({ ...p, isCurrent: e.target.checked }))}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-neutral-700">Currently enrolled</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edu-start"
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
          />
          {form.isCurrent ? (
            <Input
              id="edu-expected"
              label="Expected Graduation"
              type="date"
              value={form.expectedGraduationDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, expectedGraduationDate: e.target.value }))
              }
            />
          ) : (
            <Input
              id="edu-end"
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
            />
          )}
        </div>
        {isError && (
          <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
        )}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={isPending}
          saveLabel={isEdit ? "Save changes" : "Add education"}
        />
      </div>
    </Modal>
  );
}

// ─── Modal: Add Language ──────────────────────────────────────────────────────
function AddLangModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addMut = useAddLanguage();
  const [langQ, setLangQ] = useState("");
  const dLangQ = useDebounce(langQ, 300);
  const { data: rawLangs = [], isFetching: fetchingLangs } = useLanguagesSearch(dLangQ);
  const langs = rawLangs.map((l) => ({ id: l.id, name: l.nameEn }));

  const { data: rawLevels = [] } = useProficiencyLevels();
  const levelOptions = [
    { value: "", label: "Select level" },
    ...rawLevels.map((l) => ({ value: l.id, label: l.nameEn })),
  ];

  const [form, setForm] = useState({
    languageId: "",
    languageName: "",
    proficiencyLevelId: "",
    isNative: false,
  });

  const handleSave = async () => {
    if (!form.languageId || !form.proficiencyLevelId) return;
    await addMut.mutateAsync({
      languageId: form.languageId,
      proficiencyLevelId: form.proficiencyLevelId,
      isNative: form.isNative,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Language">
      <div className="flex flex-col gap-4">
        <InlineSearch
          label="Language"
          selectedName={form.languageName}
          items={langs}
          isFetching={fetchingLangs}
          onSearch={setLangQ}
          onSelect={(item) =>
            setForm((p) => ({ ...p, languageId: item.id, languageName: item.name }))
          }
          onClear={() => setForm((p) => ({ ...p, languageId: "", languageName: "" }))}
          minSearchLength={0}
        />
        <Select
          id="lang-level"
          label="Proficiency Level"
          value={form.proficiencyLevelId}
          onChange={(e) => setForm((p) => ({ ...p, proficiencyLevelId: e.target.value }))}
          options={levelOptions}
        />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isNative}
            onChange={(e) => setForm((p) => ({ ...p, isNative: e.target.checked }))}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-neutral-700">Native language</span>
        </label>
        {addMut.isError && (
          <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
        )}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={addMut.isPending}
          saveLabel="Add language"
        />
      </div>
    </Modal>
  );
}

// ─── Modal: Upload Document ───────────────────────────────────────────────────
function UploadDocModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const uploadMut = useUploadDocument();
  const { data: docTypes = [] } = useDocumentTypes();
  const docTypeOptions = [
    { value: "", label: "Select type" },
    ...docTypes.map((t) => ({ value: t.id, label: t.nameEn })),
  ];

  const [typeId, setTypeId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (!file || !typeId) return;
    await uploadMut.mutateAsync({ documentTypeId: typeId, file });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Document">
      <div className="flex flex-col gap-4">
        <Select
          id="doc-type"
          label="Document Type"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          options={docTypeOptions}
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-neutral-800 text-xs">File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-neutral-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
        </div>
        {uploadMut.isError && (
          <p className="text-xs text-red-500">Upload failed. Please try again.</p>
        )}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={uploadMut.isPending}
          saveLabel="Upload"
        />
      </div>
    </Modal>
  );
}

// ─── Main ProfilePage ─────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const [activeTab, setActiveTab] = useState<TabId>("education");

  // Modal state
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [editEduOpen, setEditEduOpen] = useState(false);
  const [editEduData, setEditEduData] = useState<ApiEducation | null>(null);
  const [addLangOpen, setAddLangOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);

  // Delete mutations (delete by languageId, since entries have no separate id)
  const deleteEduMut = useDeleteEducation();
  const deleteLangMut = useDeleteLanguage();
  const deleteDocMut = useDeleteDocument();

  // Reference data for ID → name lookups
  const { data: allLangs = [] } = useLanguagesSearch("");
  const { data: profLevels = [] } = useProficiencyLevels();
  const { data: maritalStatuses = [] } = useMaritalStatuses();
  const { data: docTypes = [] } = useDocumentTypes();
  const { data: eduLevels = [] } = useEducationLevels();
  const { data: allCountriesForNat = [] } = useCountriesSearch("");
  const { data: allCountriesForRes = [] } = useCountriesSearch("");
  const { data: citiesForCountry = [] } = useCitiesForCountry(profile?.countryOfResidenceId ?? "");

  const langMap = useMemo(
    () => new Map(allLangs.map((l) => [l.id, l.nameEn])),
    [allLangs],
  );
  const profMap = useMemo(
    () => new Map(profLevels.map((l) => [l.id, l.nameEn])),
    [profLevels],
  );
  const maritalMap = useMemo(
    () => new Map(maritalStatuses.map((s) => [s.id, s.nameEn])),
    [maritalStatuses],
  );
  const docTypeMap = useMemo(
    () => new Map(docTypes.map((t) => [t.id, t.nameEn])),
    [docTypes],
  );
  const eduLevelMap = useMemo(
    () => new Map(eduLevels.map((l) => [l.id, l.nameEn])),
    [eduLevels],
  );
  const countryMap = useMemo(
    () => new Map(allCountriesForRes.map((c) => [c.id, c.nameEn])),
    [allCountriesForRes],
  );
  const nationalityMap = useMemo(
    () => new Map(allCountriesForNat.map((c) => [c.id, c.nationalityNameEn ?? c.nameEn])),
    [allCountriesForNat],
  );
  const cityMap = useMemo(
    () => new Map(citiesForCountry.map((c) => [c.id, c.nameEn])),
    [citiesForCountry],
  );

  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : user
      ? `${user.firstName} ${user.lastName}`.trim()
      : "—";
  const email = profile?.email ?? user?.email ?? "—";
  const completionPct = profile?.completionPct ?? user?.userProfile?.completionPct ?? 0;

  const allEducations = profile?.educations ?? [];
  const languages = profile?.languages ?? [];
  const documents = profile?.documents ?? [];

  const openAddEdu = () => {
    setEditEduData(null);
    setEditEduOpen(true);
  };

  const openEditEdu = (edu: ApiEducation) => {
    setEditEduData(edu);
    setEditEduOpen(true);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Modals */}
      <EditPersonalModal
        open={editPersonalOpen}
        onClose={() => setEditPersonalOpen(false)}
        profile={profile}
        resolvedNationalityName={nationalityMap.get(profile?.nationalityId ?? "") ?? ""}
        resolvedCountryName={countryMap.get(profile?.countryOfResidenceId ?? "") ?? ""}
        resolvedCityName={cityMap.get(profile?.currentCityId ?? "") ?? ""}
      />
      <EditEduModal
        open={editEduOpen}
        onClose={() => setEditEduOpen(false)}
        education={editEduData}
      />
      <AddLangModal open={addLangOpen} onClose={() => setAddLangOpen(false)} />
      <UploadDocModal open={uploadDocOpen} onClose={() => setUploadDocOpen(false)} />

      {/* ── Header card ── */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm px-6 py-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
          {profile?.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profilePhotoUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-3xl text-neutral-500">person</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-neutral-900 truncate">{fullName}</h1>
          <p className="text-sm text-neutral-500 truncate">{email}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-semibold text-primary">{completionPct}% Complete</span>
          <div className="w-28 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex gap-5">
        {/* Desktop sidebar nav */}
        <nav className="w-52 shrink-0 flex-col gap-1 hidden md:flex">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive ? "bg-primary text-white" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile tab strip */}
        <div className="flex md:hidden gap-2 mb-1 w-full overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-8 flex items-center justify-center">
              <div className="flex items-center gap-3 text-neutral-400">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading profile…</span>
              </div>
            </div>
          ) : (
            <>
              {/* ── EDUCATION ── */}
              {activeTab === "education" && (
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                  <SectionHeader icon="school" title="Education" onAdd={openAddEdu} />

                  {allEducations.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-neutral-400 mb-3">No education records yet.</p>
                      <button
                        type="button"
                        onClick={openAddEdu}
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        Add your first education record
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {allEducations.map((edu) => {
                        const gradYear = edu.endDate
                          ? new Date(edu.endDate).getFullYear().toString()
                          : edu.expectedGraduationDate
                          ? new Date(edu.expectedGraduationDate).getFullYear().toString()
                          : undefined;

                        return (
                          <div
                            key={edu.id}
                            className="relative border border-neutral-100 rounded-xl p-4"
                          >
                            <div className="absolute top-3 right-3 flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => openEditEdu(edu)}
                                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
                                aria-label="Edit education"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEduMut.mutate(edu.id)}
                                disabled={deleteEduMut.isPending}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                aria-label="Delete education"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                            <div className="pr-16">
                              <FieldGrid>
                                <Field
                                  label="Education Level"
                                  value={
                                    edu.educationLevelId
                                      ? eduLevelMap.get(edu.educationLevelId)
                                      : undefined
                                  }
                                />
                                <Field label="GPA" value={fmtGpa(edu.gpaRaw, edu.gpaScale)} />
                              </FieldGrid>
                              {gradYear && (
                                <div className="mt-5">
                                  <Field label="Graduation Year" value={gradYear} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* ── BACKGROUND & SKILLS ── */}
              {activeTab === "background" && (
                <div className="flex flex-col gap-5">
                  {/* Personal details */}
                  <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                    <SectionHeader
                      icon="person"
                      title="Personal Details"
                      onEdit={() => setEditPersonalOpen(true)}
                    />
                    <FieldGrid>
                      <Field
                        label="Date of Birth"
                        value={
                          profile?.dateOfBirth
                            ? new Date(profile.dateOfBirth).toLocaleDateString()
                            : undefined
                        }
                      />
                      <Field label="Phone" value={profile?.phone ?? undefined} />
                      <Field
                        label="Nationality"
                        value={
                          profile?.nationalityId
                            ? nationalityMap.get(profile.nationalityId)
                            : undefined
                        }
                      />
                      <Field
                        label="Current Country"
                        value={
                          profile?.countryOfResidenceId
                            ? countryMap.get(profile.countryOfResidenceId)
                            : undefined
                        }
                      />
                      <Field
                        label="Current City"
                        value={
                          profile?.currentCityId
                            ? cityMap.get(profile.currentCityId)
                            : undefined
                        }
                      />
                      <Field
                        label="Marital Status"
                        value={
                          profile?.maritalStatusId
                            ? maritalMap.get(profile.maritalStatusId)
                            : undefined
                        }
                      />
                    </FieldGrid>
                    {profile?.bio && (
                      <div className="mt-5">
                        <p className="text-xs text-neutral-400 mb-0.5">Bio</p>
                        <p className="text-sm text-neutral-900">{profile.bio}</p>
                      </div>
                    )}
                  </section>

                  {/* Languages */}
                  <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                    <SectionHeader
                      icon="translate"
                      title="Languages"
                      onAdd={() => setAddLangOpen(true)}
                    />
                    {languages.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-neutral-400 mb-2">No languages added yet.</p>
                        <button
                          type="button"
                          onClick={() => setAddLangOpen(true)}
                          className="text-sm font-medium text-primary hover:underline cursor-pointer"
                        >
                          Add a language
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {languages.map((lang) => (
                          <div
                            key={lang.languageId}
                            className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg pl-3 pr-2 py-2"
                          >
                            <span className="text-sm font-medium text-neutral-900">
                              {langMap.get(lang.languageId) ?? lang.languageId}
                            </span>
                            {lang.isNative && (
                              <span className="text-xs text-neutral-400">(native)</span>
                            )}
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-white">
                              {profMap.get(lang.proficiencyLevelId) ?? "—"}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteLangMut.mutate(lang.languageId)}
                              disabled={deleteLangMut.isPending}
                              className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                              aria-label={`Remove ${langMap.get(lang.languageId) ?? "language"}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {activeTab === "documents" && (
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                  <SectionHeader
                    icon="folder_open"
                    title="Documents"
                    onAdd={() => setUploadDocOpen(true)}
                  />
                  {documents.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-neutral-400 mb-3">No documents uploaded yet.</p>
                      <button
                        type="button"
                        onClick={() => setUploadDocOpen(true)}
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        Upload a document
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 border border-neutral-100"
                        >
                          <DocIcon mimeType={doc.mimeType} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {doc.displayName ?? "Document"}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {doc.documentTypeId ? docTypeMap.get(doc.documentTypeId) : ""}
                              {doc.sizeBytes
                                ? ` • ${(doc.sizeBytes / 1024).toFixed(0)} KB`
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => deleteDocMut.mutate(doc.id)}
                              disabled={deleteDocMut.isPending}
                              className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                              aria-label="Delete document"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
