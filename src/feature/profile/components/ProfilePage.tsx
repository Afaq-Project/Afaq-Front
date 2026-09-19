"use client";

import React, { useState } from "react";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import Image from "next/image";
import Link from "next/link";
import type { DocumentItem } from "@/src/feature/profile/types";

/* ───────────────────── experience-level display map ───────────────────── */
const EXP_LABELS: Record<string, string> = {
  none: "No experience",
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior-level",
};

/* ───────────────────── sidebar nav items ───────────────────── */
const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "applications", label: "Applications", icon: "description" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "billing", label: "Billing", icon: "payments" },
] as const;

/* ───────────────────── nav items that link to their own page instead of switching tabs ───────────────────── */
const NAV_ROUTES: Partial<Record<(typeof NAV_ITEMS)[number]["id"], string>> = {
  security: "/settings",
  billing: "/billing",
};

/* ───────────────────── document file-type icon helper ───────────────────── */
function DocIcon({ type }: { type: string }) {
  const isPdf = type.includes("pdf");
  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isPdf
          ? "bg-danger-50 text-danger-600"
          : "bg-info-50 text-info-600"
      }`}
    >
      <span className="material-symbols-outlined text-xl">
        {isPdf ? "picture_as_pdf" : "image"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ProfilePage                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */
export function ProfilePage() {
  const { profile, completionPercentage } = useProfile();
  const [activeNav, setActiveNav] = useState("profile");

  /* Collect uploaded documents */
  const uploadedDocs: DocumentItem[] = Object.values(profile.documents).filter(
    (d): d is DocumentItem => d !== null && d.status === "uploaded"
  );

  /* Derive readable degree label from educationLevel + fieldsOfStudy */
  const degreeLabel = (() => {
    const level = profile.education.educationLevel;
    const field = profile.education.fieldsOfStudy[0] ?? "";
    if (level === "Graduate" && field) return `Master's in ${field}`;
    if (level === "PhD" && field) return `PhD in ${field}`;
    if (level === "Undergraduate" && field) return `Bachelor's in ${field}`;
    if (level && field) return `${level} — ${field}`;
    return level || "—";
  })();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ──────────── Top header card ──────────── */}
      <div className="bg-neutral-50 rounded-xl shadow-card px-6 py-5 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative w-16 h-16 flex-shrink-0">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-neutral-600">
                person
              </span>
            </div>
          )}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <h1 className="text-h1 font-semibold text-neutral-900 truncate">
            {profile.name}
          </h1>
          <p className="text-small text-neutral-600 truncate">{profile.email}</p>
        </div>

        {/* Completion badge + bar */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-small font-semibold text-primary-600">
            {completionPercentage}% Complete
          </span>
          <div className="w-28 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ──────────── Body: sidebar + content ──────────── */}
      <div className="flex gap-6">
        {/* Left sidebar nav */}
        <nav className="w-52 flex-shrink-0 flex flex-col gap-1 hidden md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            const navClassName = `flex items-center gap-3 px-4 py-2.5 rounded-lg text-body font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-primary-600 text-white"
                : "text-neutral-800 hover:bg-neutral-50"
            }`;
            const navIcon = (
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            );

            const route = NAV_ROUTES[item.id];
            if (route) {
              return (
                <Link key={item.id} href={route} className={navClassName}>
                  {navIcon}
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={navClassName}
              >
                {navIcon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* ── Education ── */}
          <section className="bg-neutral-50 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-primary-600">
                  school
                </span>
                <h2 className="text-h2 font-semibold text-neutral-900">Education</h2>
              </div>
              <button className="text-small font-medium text-primary-600 hover:underline cursor-pointer">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-caption text-neutral-400 mb-1">Degree</p>
                <p className="text-body font-medium text-neutral-900">{degreeLabel}</p>
              </div>
              <div>
                <p className="text-caption text-neutral-400 mb-1">GPA</p>
                <p className="text-body font-medium text-neutral-900">
                  {profile.background.gpa
                    ? `${profile.background.gpa} / ${profile.background.gpaScale}`
                    : "—"}
                </p>
              </div>
            </div>
          </section>

          {/* ── Background & Goals ── */}
          <section className="bg-neutral-50 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-primary-600">
                  public
                </span>
                <h2 className="text-h2 font-semibold text-neutral-900">
                  Background &amp; Goals
                </h2>
              </div>
              <button className="text-small font-medium text-primary-600 hover:underline cursor-pointer">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-caption text-neutral-400 mb-1">Nationality</p>
                <p className="text-body font-medium text-neutral-900">
                  {profile.education.nationality || "—"}
                </p>
              </div>
              <div>
                <p className="text-caption text-neutral-400 mb-1">Experience Level</p>
                <p className="text-body font-medium text-neutral-900">
                  {EXP_LABELS[profile.background.experienceLevel] ?? "—"}
                </p>
              </div>
            </div>
          </section>

          {/* ── Skills & Language ── */}
          <section className="bg-neutral-50 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-primary-600">
                  psychology
                </span>
                <h2 className="text-h2 font-semibold text-neutral-900">
                  Skills &amp; Language
                </h2>
              </div>
              <button className="text-small font-medium text-primary-600 hover:underline cursor-pointer">
                Edit
              </button>
            </div>

            {/* Skills chips */}
            <div className="mb-4">
              <p className="text-caption text-neutral-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-small font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="text-caption text-neutral-400 mb-2">Languages</p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    <span className="text-body font-medium text-neutral-900">
                      {lang.language}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-caption font-semibold bg-primary-600 text-white">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Documents ── */}
          <section className="bg-neutral-50 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-primary-600">
                  folder_open
                </span>
                <h2 className="text-h2 font-semibold text-neutral-900">Documents</h2>
              </div>
              <button className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-800 text-white text-small font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base">upload</span>
                Upload New
              </button>
            </div>

            {uploadedDocs.length === 0 ? (
              <p className="text-small text-neutral-400">No documents uploaded yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {uploadedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 bg-background rounded-lg px-4 py-3 border border-neutral-100"
                  >
                    <DocIcon type={doc.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-neutral-900 truncate">
                        {doc.name}
                      </p>
                      <p className="text-caption text-neutral-400">
                        {doc.size} • {doc.uploadedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="View document"
                        className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </button>
                      <button
                        aria-label="Download document"
                        className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          download
                        </span>
                      </button>
                      <button
                        aria-label="Delete document"
                        className="p-1.5 rounded-md hover:bg-danger-50 text-neutral-400 hover:text-danger-600 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
