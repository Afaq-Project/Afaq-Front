"use client";

import React, { useState } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useProfileQuery } from "@/src/feature/profile/hooks/useProfileQuery";
import type { ApiDocument } from "@/src/feature/profile/types/api";

type TabId = "education" | "background" | "documents";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "education", label: "Education", icon: "school" },
  { id: "background", label: "Background & Skills", icon: "psychology" },
  { id: "documents", label: "Documents", icon: "folder_open" },
];

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

function SectionHeader({ icon, title, onEdit }: { icon: string; title: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
      )}
    </div>
  );
}

function DocIcon({ mimeType }: { mimeType?: string }) {
  const isPdf = mimeType?.includes("pdf");
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isPdf ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
      <span className="material-symbols-outlined text-lg">{isPdf ? "picture_as_pdf" : "description"}</span>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const [activeTab, setActiveTab] = useState<TabId>("education");

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "—";
  const email = user?.email ?? "—";
  const completionPct = user?.userProfile?.completionPct ?? profile?.completionPct ?? 0;

  const education = profile?.educations?.[0];
  const allEducations = profile?.educations ?? [];
  const languages = profile?.languages ?? [];
  const documents = profile?.documents ?? [];
  const personal = profile?.personal;

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* ── Top header card ── */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm px-6 py-5 flex items-center gap-5">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {personal?.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personal.profilePhotoUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-3xl text-neutral-500">person</span>
          )}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-neutral-900 truncate">{fullName}</h1>
          <p className="text-sm text-neutral-500 truncate">{email}</p>
        </div>

        {/* Completion */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-sm font-semibold text-primary">{completionPct}% Complete</span>
          <div className="w-28 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex gap-5">
        {/* Left sidebar */}
        <nav className="w-52 flex-shrink-0 flex-col gap-1 hidden md:flex">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${isActive ? "bg-primary text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
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
              {/* ── EDUCATION TAB ── */}
              {activeTab === "education" && (
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                  <SectionHeader icon="school" title="Education" onEdit={() => {}} />

                  {allEducations.length === 0 ? (
                    <p className="text-sm text-neutral-400">No education records yet.</p>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {allEducations.map((edu) => {
                        const gradYear = edu.endDate
                          ? new Date(edu.endDate).getFullYear().toString()
                          : edu.expectedGraduationDate
                          ? new Date(edu.expectedGraduationDate).getFullYear().toString()
                          : undefined;

                        const gpaDisplay = edu.gpaRaw != null
                          ? `${edu.gpaRaw}${edu.gpaScale ? ` (${edu.gpaScale.replace("OUT_OF_", "/ ").replace("PERCENTAGE", "%").replace("LETTER_GRADE", "Letter")})` : ""}`
                          : undefined;

                        return (
                          <div key={edu.id}>
                            <FieldGrid>
                              <Field label="Education Level" value={edu.educationLevel?.name} />
                              <Field label="GPA" value={gpaDisplay} />
                              <Field label="Institution" value={edu.institution?.name} />
                              <Field label="Degree" value={edu.major?.name} />
                            </FieldGrid>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-5">
                              <Field label="Graduation Year" value={gradYear} />
                              <Field
                                label="Field(s) of Study"
                                value={[edu.major?.name, edu.minorMajor?.name].filter(Boolean).join(", ")}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* ── BACKGROUND & SKILLS TAB ── */}
              {activeTab === "background" && (
                <div className="flex flex-col gap-5">
                  {/* Personal details */}
                  <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                    <SectionHeader icon="person" title="Personal Details" onEdit={() => {}} />
                    <FieldGrid>
                      <Field label="Date of Birth" value={personal?.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString() : undefined} />
                      <Field label="Phone" value={personal?.phone} />
                      <Field label="Nationality" value={personal?.nationality?.name} />
                      <Field label="Current Country" value={personal?.countryOfResidence?.name} />
                      <Field label="Current City" value={personal?.currentCity?.name} />
                    </FieldGrid>
                  </section>

                  {/* Languages */}
                  <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                    <SectionHeader icon="translate" title="Languages" onEdit={() => {}} />
                    {languages.length === 0 ? (
                      <p className="text-sm text-neutral-400">No languages added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {languages.map((lang) => (
                          <div key={lang.id} className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2">
                            <span className="text-sm font-medium text-neutral-900">{lang.language?.name}</span>
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-white">
                              {lang.proficiencyLevel?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* ── DOCUMENTS TAB ── */}
              {activeTab === "documents" && (
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
                  <SectionHeader icon="folder_open" title="Documents" />

                  {documents.length === 0 ? (
                    <p className="text-sm text-neutral-400">No documents uploaded yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {documents.map((doc: ApiDocument) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 border border-neutral-100"
                        >
                          <DocIcon mimeType={doc.mimeType} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {doc.fileName ?? doc.documentType?.name ?? "Document"}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {doc.documentType?.name}
                              {doc.fileSize ? ` • ${(doc.fileSize / 1024).toFixed(0)} KB` : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Download document"
                                className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">download</span>
                              </a>
                            )}
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
