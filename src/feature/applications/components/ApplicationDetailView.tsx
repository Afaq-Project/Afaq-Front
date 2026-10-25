"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { AskAiCard, UpdateStatusMenu } from "@/src/feature/opportunities/components/details/SideCards";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { isoDateFromToday } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import type { ApplicationActivityItem, ApplicationDetail, ApplicationDocument } from "../types/detail";
import type { ApplicationStatus } from "../types/status";
import { ApplicationDocumentsCard } from "./detail/ApplicationDocumentsCard";
import { ApplicationHeader } from "./detail/ApplicationHeader";
import { ActivityCard, NotesCard } from "./detail/NotesAndActivity";

// Suggested questions for the assistant by stage: applications.detail.questions.<key>.
const AI_QUESTIONS = {
  active: ["remaining", "reviewStatement", "plan"],
  waiting: ["afterSubmit", "followUp", "interview"],
  decided: ["nextStep", "thankYou", "similar"],
} as const;

function stageFor(status: ApplicationStatus): keyof typeof AI_QUESTIONS {
  if (status === "not_started" || status === "in_progress") return "active";
  if (status === "submitted" || status === "in_review") return "waiting";
  return "decided";
}

/**
 * Application details. Desktop: header and documents in the main column; the AI card, activity
 * and notes on the side. Below 1024px one column (header, documents, AI, activity, notes); on
 * phones "Update status" also sits in a bar above the tab bar.
 */
export function ApplicationDetailView({ application }: { application: ApplicationDetail }) {
  const t = useTranslations("applications.detail");
  const tStatus = useTranslations("applicationStatus");
  const opportunity = application.opportunityId ? getMockOpportunityById(application.opportunityId) : undefined;
  const [now] = useState(() => new Date());

  // TODO: there's no tracker API yet, so status, linked documents and the activity they add are
  // local and reset on reload.
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [updatedAt, setUpdatedAt] = useState(application.updatedAt);
  const [documents, setDocuments] = useState<ApplicationDocument[]>(application.documents);
  const [activity, setActivity] = useState<ApplicationActivityItem[]>(application.activity);

  const log = (item: Omit<ApplicationActivityItem, "id" | "at">) => {
    const today = isoDateFromToday(0);
    setActivity((prev) => [{ ...item, id: `local-${prev.length}`, at: today }, ...prev]);
    setUpdatedAt(today);
  };

  const changeStatus = (next: ApplicationStatus) => {
    if (next === status) return;
    setStatus(next);
    log({ kind: "status", status: next });
    notify.success(t("statusUpdated", { status: tStatus(next) }));
  };

  const linkDocument = (doc: ApplicationDocument) => {
    setDocuments((prev) => (prev.some((d) => d.id === doc.id) ? prev : [...prev, doc]));
    log({ kind: "document", documentName: doc.name });
    notify.success(t("documentLinked"));
  };

  const stage = stageFor(status);
  const ai = (
    <AskAiCard
      title={t("askAi")}
      questions={AI_QUESTIONS[stage].map((key) => t(`questions.${key}`))}
      hrefFor={(q) => `/ai?application=${encodeURIComponent(application.id)}&q=${encodeURIComponent(q)}`}
      layout="stack"
    />
  );

  return (
    // Room for the phone status bar so it never covers the last card.
    <div className="flex flex-col gap-6 pb-20 md:pb-0">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 rounded-sm w-fit text-neutral-600 hover:text-neutral-900 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      >
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
        {t("back")}
      </Link>

      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2 min-w-0">
          <ApplicationHeader
            application={application}
            opportunity={opportunity}
            status={status}
            onStatusChange={changeStatus}
            updatedAt={updatedAt}
            now={now}
          />
          <ApplicationDocumentsCard applicationId={application.id} required={opportunity?.requiredDocuments} linked={documents} onLink={linkDocument} />
          {/* Below 1024px the AI card comes right after documents. */}
          <div className="lg:hidden">{ai}</div>
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <div className="hidden lg:block">{ai}</div>
          <ActivityCard items={activity} now={now} />
          <NotesCard initial={application.notes} />
        </div>
      </div>

      <div className="md:hidden end-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] start-0 z-30 fixed bg-white px-4 py-3 border-neutral-100 border-t">
        <UpdateStatusMenu status={status} onChange={changeStatus} side="top" />
      </div>
    </div>
  );
}
