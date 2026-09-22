"use client";

import React, { useState } from "react";
import "./ProfilePage.css";
import { User, GraduationCap, Brain, Folder, Pencil, Download, Trash2, Eye } from "lucide-react";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { DocumentItem } from "@/src/feature/profile/types";

const EXP_LABELS: Record<string, string> = {
  none: "No experience",
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior-level",
};

export function ProfilePage() {
  const { profile, completionPercentage } = useProfile();
  const [activeTab, setActiveTab] = useState("education");

  const uploadedDocs: DocumentItem[] = Object.values(profile.documents).filter(
    (d): d is DocumentItem => d !== null && d.status === "uploaded"
  );

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
    <div className="profile-page-wrapper">
      <div className="profile-page-container">
        {/* Profile Header (Avatar, Name, Progress) & Personal Details */}
        <div className="profile-header-card" style={{ marginBottom: "32px" }}>
          <div className="profile-header-top">
            <div className="profile-header-left">
              <div className="profile-avatar">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={36} strokeWidth={1.5} />
                )}
              </div>
              <div>
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-email">{profile.email}</p>
              </div>
            </div>

            <div className="profile-progress-container">
              <span className="profile-progress-text">{completionPercentage}% Complete</span>
              <div className="profile-progress-bar-bg">
                <div
                  className="profile-progress-bar-fill"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <hr className="profile-divider" />

          {/* Personal Details */}
          <div className="profile-personal-details">
            <div className="profile-personal-header">
              <h2 className="profile-personal-title">Personal Details</h2>
              <Pencil size={20} strokeWidth={2} className="profile-edit-icon" />
            </div>

            <div className="profile-personal-grid">
              <div>
                <p className="profile-field-label">Date of Birth</p>
                <p className="profile-field-value">—</p>
              </div>
              <div>
                <p className="profile-field-label">Phone</p>
                <p className="profile-field-value">—</p>
              </div>
              <div>
                <p className="profile-field-label">Nationality</p>
                <p className="profile-field-value">{profile.education.nationality || "—"}</p>
              </div>
              <div>
                <p className="profile-field-label">Current Country</p>
                <p className="profile-field-value">—</p>
              </div>
              <div>
                <p className="profile-field-label">Current City</p>
                <p className="profile-field-value">—</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="profile-main-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <button
              onClick={() => setActiveTab("education")}
              className={`profile-sidebar-item ${activeTab === "education" ? "active" : "inactive"}`}
            >
              <GraduationCap size={24} strokeWidth={1.75} />
              <span>Education</span>
            </button>
            <button
              onClick={() => setActiveTab("background")}
              className={`profile-sidebar-item ${activeTab === "background" ? "active" : "inactive"}`}
            >
              <Brain size={24} strokeWidth={1.75} />
              <span>Background & Skills</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`profile-sidebar-item ${activeTab === "documents" ? "active" : "inactive"}`}
            >
              <Folder size={24} strokeWidth={1.75} />
              <span>Documents</span>
            </button>
          </aside>

          {/* Content Area */}
          <div className="profile-content-area">
            {activeTab === "education" && (
              <div className="profile-education-card">
                <div className="profile-education-header">
                  <div className="profile-education-title-wrapper">
                    <GraduationCap size={28} strokeWidth={2} className="profile-education-title-icon" />
                    <h2 className="profile-education-title">Education</h2>
                  </div>
                  <Pencil size={20} strokeWidth={2} className="profile-edit-icon" />
                </div>

                <div className="profile-education-grid">
                  <div>
                    <p className="profile-field-label">Education Level</p>
                    <p className="profile-field-value">{profile.education.educationLevel || "—"}</p>
                  </div>
                  <div>
                    <p className="profile-field-label">GPA</p>
                    <p className="profile-field-value">
                      {profile.background.gpa ? `${profile.background.gpa} / ${profile.background.gpaScale}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="profile-field-label">Institution</p>
                    <p className="profile-field-value">—</p>
                  </div>
                  <div>
                    <p className="profile-field-label">Degree</p>
                    <p className="profile-field-value">{degreeLabel}</p>
                  </div>
                  <div>
                    <p className="profile-field-label">Graduation Year</p>
                    <p className="profile-field-value">—</p>
                  </div>
                  <div />
                  <div>
                    <p className="profile-field-label">Field(s) of Study</p>
                    <p className="profile-field-value">
                      {profile.education.fieldsOfStudy.length > 0 ? profile.education.fieldsOfStudy.join(", ") : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "background" && (
              <div className="profile-education-card">
                <div className="profile-education-header">
                  <div className="profile-education-title-wrapper">
                    <Brain size={28} strokeWidth={2} className="profile-education-title-icon" />
                    <h2 className="profile-education-title">Background & Skills</h2>
                  </div>
                  <Pencil size={20} strokeWidth={2} className="profile-edit-icon" />
                </div>

                <div className="profile-education-grid" style={{ marginBottom: "32px" }}>
                  <div>
                    <p className="profile-field-label">Experience Level</p>
                    <p className="profile-field-value">{EXP_LABELS[profile.background.experienceLevel] ?? "—"}</p>
                  </div>
                  <div>
                    <p className="profile-field-label">Financial Need</p>
                    <p className="profile-field-value capitalize">{profile.background.financialNeed.replace("_", " ")}</p>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p className="profile-field-label">Goals</p>
                    <p className="profile-field-value" style={{ whiteSpace: "pre-wrap" }}>{profile.background.goals || "—"}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <p className="profile-field-label" style={{ marginBottom: "12px" }}>Skills</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {profile.skills.skills.length > 0 ? (
                      profile.skills.skills.map((skill) => (
                        <span key={skill} style={{ padding: "6px 16px", backgroundColor: "#E2E8F0", borderRadius: "9999px", fontSize: "14px", fontWeight: "600", color: "#2D3748" }}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="profile-field-value">—</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="profile-field-label" style={{ marginBottom: "12px" }}>Languages</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {profile.skills.languages.length > 0 ? (
                      profile.skills.languages.map((lang) => (
                        <div key={lang.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "600", color: "#2D3748" }}>{lang.language}</span>
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#CBD5E0" }}></span>
                          <span style={{ fontSize: "14px", color: "#718096" }}>{lang.level}</span>
                        </div>
                      ))
                    ) : (
                      <span className="profile-field-value">—</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="profile-education-card">
                <div className="profile-education-header">
                  <div className="profile-education-title-wrapper">
                    <Folder size={28} strokeWidth={2} className="profile-education-title-icon" />
                    <h2 className="profile-education-title">Documents</h2>
                  </div>
                </div>

                {uploadedDocs.length === 0 ? (
                  <p className="profile-field-label">No documents uploaded yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {uploadedDocs.map((doc) => (
                      <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="profile-field-value" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{doc.name}</p>
                          <p className="profile-field-label" style={{ fontSize: "13px", margin: 0 }}>{doc.size} • {doc.uploadedAt}</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button style={{ padding: "8px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#718096" }}>
                            <Eye size={20} />
                          </button>
                          <button style={{ padding: "8px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#718096" }}>
                            <Download size={20} />
                          </button>
                          <button style={{ padding: "8px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#E53E3E" }}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
