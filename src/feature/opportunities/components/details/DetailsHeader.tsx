import { Building2, CalendarDays, ExternalLink, MapPin, Wallet, type LucideIcon } from "lucide-react";
import { formatDeadline } from "@/src/feature/applications/services/utils";
import { cn } from "@/src/feature/dashboard/services/utils";
import { DEADLINE_URGENCY_TEXT, formatDeadlineDay, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import { countryName } from "@/src/shared/lib/countries";
import Badge from "@/src/shared/ui/Badge";
import { HorizonLines } from "@/src/shared/ui/HorizonLines";
import type { OpportunityDetail } from "../../types/opportunity";
import { FlagTile } from "../FlagTile";
import { FieldPattern } from "./FieldPattern";
import { formatDaysLeft } from "../../services/utils";
import { FUNDING_LABEL } from "../labels";

function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 min-w-0">
      <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-md size-8 text-primary-800 shrink-0">
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-caption text-neutral-600">{label}</p>
        <div className="font-medium text-body text-neutral-900 break-words">{children}</div>
      </div>
    </li>
  );
}

/** "12 days left", "Ends tomorrow", "Closed", colored by urgency. */
function Countdown({ daysLeft }: { daysLeft: number }) {
  if (daysLeft < 0) return <span className="block font-normal text-neutral-600 text-small">Closed</span>;
  const urgency = getDeadlineUrgency(daysLeft);
  const text =
    urgency === "urgent" ? formatDeadline(daysLeft) : urgency === "soon" ? `${daysLeft} days left` : formatDaysLeft(daysLeft);
  return <span className={cn("block font-normal text-small", DEADLINE_URGENCY_TEXT[urgency])}>{text}</span>;
}

/**
 * Header card: a green-50 band (the official header image when one exists, otherwise the
 * horizon pattern), the flag tile overlapping its edge, then title, provider, fact chips and
 * the key facts (deadline, funding, location, provider).
 */
export function DetailsHeader({ opportunity, daysLeft }: { opportunity: OpportunityDetail; daysLeft: number }) {
  const closed = daysLeft < 0;
  const remote = Boolean(opportunity.isRemote) || !opportunity.countryCode;
  const country = opportunity.countryCode ? countryName(opportunity.countryCode) : undefined;

  const chips = [
    opportunity.type,
    FUNDING_LABEL[opportunity.fundingStatus],
    opportunity.level,
    opportunity.fieldOfStudy,
    remote ? "Remote" : country,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <header className="bg-white border border-neutral-100 rounded-lg overflow-hidden">
      <div className="relative bg-primary-50 h-35 overflow-hidden">
        {opportunity.headerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- comes from the opportunity's official source
          <img src={opportunity.headerImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            {/* Barely-there texture under the icons: white 1px lines at 50%. */}
            <HorizonLines className="absolute inset-0 h-full" lineClassName="stroke-white opacity-50" />
            <FieldPattern id={opportunity.id} field={opportunity.fieldOfStudy} type={opportunity.type} />
          </>
        )}
      </div>

      <div className="px-5 md:px-6 pb-5 md:pb-6">
        {/* Overlaps the band by half its height. */}
        <FlagTile
          size="lg"
          countryCode={opportunity.countryCode}
          countryName={country}
          remote={remote}
          className="relative shadow-sm ring-4 ring-white -mt-5.25"
        />

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <h1 className="text-h1 text-neutral-900">{opportunity.title}</h1>
          {closed && <Badge tone="gray">Closed</Badge>}
        </div>

        <p className="mt-1 text-body text-neutral-600">
          {opportunity.providerUrl ? (
            <a
              href={opportunity.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-sm hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              {opportunity.provider}
              <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            opportunity.provider
          )}
        </p>

        <ul className="flex flex-wrap gap-1.5 mt-4">
          {chips.map((chip) => (
            <li key={chip} className="bg-white px-2.5 py-0.5 border border-neutral-200 rounded-full text-caption text-neutral-800">
              {chip}
            </li>
          ))}
        </ul>

        {/* Key facts: 4 across from 768px, 2×2 below. */}
        <ul aria-label="Key facts" className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-5 pt-5 border-neutral-100 border-t">
          <Fact icon={CalendarDays} label="Deadline">
            {formatDeadlineDay(opportunity.deadlineDate)}
            <Countdown daysLeft={daysLeft} />
          </Fact>
          <Fact icon={Wallet} label="Funding">
            {FUNDING_LABEL[opportunity.fundingStatus]}
          </Fact>
          <Fact icon={MapPin} label="Location">
            {opportunity.isRemote ? "Remote" : opportunity.location}
          </Fact>
          <Fact icon={Building2} label="Provider">
            {opportunity.provider}
          </Fact>
        </ul>
      </div>
    </header>
  );
}
