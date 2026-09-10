import { APPLICATIONS } from "./applications";
import type { ApplicationSummary } from "../types/application";
import type {
  ApplicationActivityItem,
  ApplicationDetail,
  ApplicationDocument,
} from "../types/detail";
import type { ApplicationStatus } from "../types/status";
import { STATUS_PROGRESS } from "../types/status";

const PROGRAM_BY_TYPE: Record<ApplicationSummary["type"], string> = {
  Scholarship: "Scholarship Program",
  Internship: "Internship Program",
};

const DOCUMENTS: ApplicationDocument[] = [
  {
    id: "transcript",
    name: "Academic Transcript",
    fileType: "PDF",
    size: "2.4 MB",
    tone: "red",
  },
  {
    id: "sop",
    name: "Statement of Purpose",
    fileType: "DOCX",
    size: "1.1 MB",
    tone: "teal",
  },
  {
    id: "english",
    name: "English Proficiency Certificate",
    fileType: "PDF",
    size: "850 KB",
    tone: "blue",
  },
];

function buildActivity(status: ApplicationStatus): ApplicationActivityItem[] {
  const created: ApplicationActivityItem = {
    id: "created",
    label: "Application created",
    timestamp: "3 weeks ago",
  };
  const sopUpdated: ApplicationActivityItem = {
    id: "sop",
    label: "Statement of Purpose updated",
    timestamp: "Yesterday, 4:15 PM",
  };
  const submitted: ApplicationActivityItem = {
    id: "submitted",
    label: "Final files submitted successfully",
    timestamp: "Today, 10:30 AM",
  };
  const underReview: ApplicationActivityItem = {
    id: "review",
    label: "Application moved to under review",
    timestamp: "1 week ago",
  };
  const accepted: ApplicationActivityItem = {
    id: "result",
    label: "Congratulations — you were accepted",
    timestamp: "2 days ago",
  };
  const rejected: ApplicationActivityItem = {
    id: "result",
    label: "Application was not successful this time",
    timestamp: "2 days ago",
  };

  switch (status) {
    case "not_started":
      return [created];
    case "in_progress":
      return [sopUpdated, created];
    case "submitted":
      return [submitted, sopUpdated, created];
    case "accepted":
      return [
        accepted,
        underReview,
        { ...submitted, timestamp: "3 weeks ago" },
        created,
      ];
    case "rejected":
      return [
        rejected,
        underReview,
        { ...submitted, timestamp: "3 weeks ago" },
        created,
      ];
  }
}

export const APPLICATION_DETAILS: ApplicationDetail[] = APPLICATIONS.map(
  (application) => ({
    ...application,
    program: PROGRAM_BY_TYPE[application.type],
    term: "Fall 2024",
    progress: STATUS_PROGRESS[application.status],
    updatedAgo: "2 hours ago",
    officialSiteUrl: "#",
    supportEmail: "support@afaq.app",
    documents: DOCUMENTS,
    activity: buildActivity(application.status),
  }),
);
