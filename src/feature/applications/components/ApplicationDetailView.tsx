"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AskAiCard, UpdateStatusMenu } from "@/src/feature/opportunities/components/details/SideCards";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { isoDateFromToday } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import type { ApplicationActivityItem, ApplicationDetail, ApplicationDocument } from "../types/detail";
import { STATUS_LABEL, type ApplicationStatus } from "../types/status";
import { ApplicationDocumentsCard } from "./detail/ApplicationDocumentsCard";
import { ApplicationHeader } from "./detail/ApplicationHeader";
import { ActivityCard, NotesCard } from "./detail/NotesAndActivity";

const AI_QUESTIONS: Record<"active" | "waiting" | "decided", string[]> = {
  active: ["What do I still need to submit?", "Review my statement of purpose", "Help me plan before the deadline"],
  waiting: ["What happens after submitting?", "How should I follow up?", "Prepare me for an interview"],
  decided: ["What should I do next?", "Help me write a thank-you note", "Find similar opportunities"],
};

function questionsFor(status: ApplicationStatus) {
  if (status === "not_started" || status === "in_progress") return AI_QUESTIONS.active;
  if (status === "submitted" || status === "in_review") return AI_QUESTIONS.waiting;
  return AI_QUESTIONS.decided;
}

/**
 * Application details. Desktop: header and documents in the main column; the AI card, activity
 * and notes on the side. Below 1024px one column (header, documents, AI, activity, notes); on
 * phones "Update status" also sits in a bar above the tab bar.
 */
export function ApplicationDetailView({ application }: { application: ApplicationDetail }) {
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
    log({ kind: "status", status: next, label: `Moved to ${STATUS_LABEL[next]}` });
    notify.success(`Status updated to ${STATUS_LABEL[next]}`);
  };

  const linkDocument = (doc: ApplicationDocument) => {
    setDocuments((prev) => (prev.some((d) => d.id === doc.id) ? prev : [...prev, doc]));
    log({ kind: "document", label: `Linked ${doc.name}` });
    notify.success("Document linked");
  };

  const ai = (
    <AskAiCard
      title="Ask about this application"
      questions={questionsFor(status)}
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
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Back to applications
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

      <div className="md:hidden right-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 z-30 fixed bg-white px-4 py-3 border-neutral-100 border-t">
        <UpdateStatusMenu status={status} onChange={changeStatus} side="top" />
      </div>
    </div>
  );
}
