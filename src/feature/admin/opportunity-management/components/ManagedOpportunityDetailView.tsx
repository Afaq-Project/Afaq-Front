import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import Badge from "@/src/shared/ui/Badge";
import { ManagedOpportunity } from "../types/opportunity";
import { STATUS_TONE, TYPE_TONE } from "../types/status";
import { formatDate, getOpportunityStatus } from "../services/utils";

export function ManagedOpportunityDetailView({
  opportunity,
}: {
  opportunity: ManagedOpportunity;
}) {
  const status = getOpportunityStatus(opportunity);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/opportunities/manage"
        className="inline-flex items-center gap-1.5 w-fit text-neutral-600 hover:text-neutral-900 text-small transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to manage opportunities
      </Link>

      <Card className="max-w-3xl">
        <Card.Header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={TYPE_TONE[opportunity.type]}>{opportunity.type}</Badge>
            <Badge
              tone={STATUS_TONE[status]}
              className={status === "Live" ? "bg-success-400/25" : undefined}
            >
              {status}
            </Badge>
            {opportunity.unpublished && <Badge tone="red">Unpublished</Badge>}
          </div>
          <h1 className="text-h1">{opportunity.title}</h1>
          <p className="text-neutral-600 text-small">{opportunity.provider}</p>
        </Card.Header>

        <Card.Body className="flex flex-col gap-6">
          <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
            <div>
              <p className="text-neutral-500 text-caption uppercase tracking-wide">Deadline</p>
              <p className="mt-1 font-medium text-neutral-900 text-small">
                {formatDate(opportunity.deadline)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <p className="text-neutral-500 text-caption uppercase tracking-wide">
                Field of study
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {opportunity.fieldsOfStudy.map((field) => (
                  <Badge key={field} tone="gray">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-neutral-800 text-caption uppercase tracking-wide">
              Description
            </p>
            <p className="mt-1.5 text-neutral-700 text-small">{opportunity.description}</p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 text-caption uppercase tracking-wide">
              Eligibility
            </p>
            <p className="mt-1.5 text-neutral-700 text-small">{opportunity.eligibility}</p>
          </div>

          <a
            href={opportunity.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 w-fit font-medium text-primary-600 hover:text-primary-800 text-small"
          >
            View official listing
            <ExternalLink size={14} strokeWidth={1.75} />
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}
