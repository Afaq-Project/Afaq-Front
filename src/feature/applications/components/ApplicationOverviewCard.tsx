import { Briefcase, GraduationCap } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import Card from "@/src/shared/ui/Card";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { ApplicationDetail } from "../types/detail";
import {
  ACTION_TONE,
  STATUS_BADGE_TINT,
  STATUS_DETAIL_MESSAGE,
  STATUS_STAGE_INDEX,
  STATUS_TONE,
  TONE_BUTTON_CLASSES,
} from "../types/status";
import { getApplicationAction } from "../services/utils";
import { ApplicationStageTracker } from "./ApplicationStageTracker";

const CONTINUABLE_STATUSES = new Set(["not_started", "in_progress"]);

export function ApplicationOverviewCard({
  application,
}: {
  application: ApplicationDetail;
}) {
  const Icon = application.type === "Scholarship" ? GraduationCap : Briefcase;
  const tone = STATUS_TONE[application.status];
  const action = getApplicationAction(application.status);
  const showAction = CONTINUABLE_STATUSES.has(application.status);

  return (
    <Card className="bg-primary-50/60 border-primary-100">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex justify-center items-center bg-primary-600 shadow-sm rounded-md w-11 h-11 text-white shrink-0">
            <Icon size={20} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h1 className="text-h2 sm:text-h1">{application.title}</h1>
            <p className="mt-1 text-neutral-600 text-small">
              {application.program} • {application.term}
            </p>
          </div>
        </div>

        <Badge tone={tone} className={cn("shrink-0", STATUS_BADGE_TINT[tone])}>
          {STATUS_DETAIL_MESSAGE[application.status]}
        </Badge>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[480px]">
          <ApplicationStageTracker
            currentIndex={STATUS_STAGE_INDEX[application.status]}
          />
        </div>
      </div>

      <div className="flex sm:flex-row flex-col sm:items-center gap-4 mt-6 pt-5 border-neutral-200/70 border-t">
        <div className="flex-1">
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-neutral-700 text-small">
              Application Progress
            </span>
            <span className="font-semibold text-neutral-900 text-small">
              {application.progress}%
            </span>
          </div>
          <ProgressBar
            value={application.progress}
            variant="application"
            className="mt-2"
            label="Application progress"
          />
          <p className="mt-1.5 text-caption text-neutral-500">
            Updated {application.updatedAgo}
          </p>
        </div>

        {showAction && (
          <button
            type="button"
            className={cn(
              "inline-flex justify-center items-center gap-1.5 px-4 rounded-sm w-fit h-10 font-medium text-small transition-colors shrink-0",
              TONE_BUTTON_CLASSES[ACTION_TONE[application.status]],
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </Card>
  );
}
