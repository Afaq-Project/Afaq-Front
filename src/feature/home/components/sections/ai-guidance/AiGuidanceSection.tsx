import { CircleCheck, ExternalLink, FileText, Lightbulb, Sparkles, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { SectionTone } from "../../../constants";
import { content } from "../../../content/en";
import { Card } from "../../ui/Card";
import { Chip, type ChipTone } from "../../ui/Chip";
import { FlagTile } from "../../ui/FlagTile";
import { FeatureSection } from "../feature/FeatureSection";

/** Chat card: the scholarship context, the conversation in the app's chat style, and the disclaimer. */
function ChatCard({ className }: { className?: string }) {
  const { chat } = content.aiGuidance.preview;

  return (
    <Card floating className={cn("flex flex-col gap-4 p-5 lg:p-5", className)}>
      <div className="flex items-start gap-2.5 pb-4 border-neutral-100 border-b">
        <FlagTile code={chat.countryCode} size="sm" className="mt-0.5" />
        <div className="min-w-0">
          <p className="font-semibold text-landing-small text-neutral-900">{chat.title}</p>
          <p className="text-landing-caption text-neutral-600">{chat.context}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {chat.messages.map((message) =>
          message.from === "user" ? (
            <p key={message.text} className="bg-primary-50 px-3.5 py-2 rounded-lg max-w-[85%] text-landing-small text-primary-900 self-end">
              {message.text}
            </p>
          ) : (
            <div key={message.text} className="flex items-start gap-2.5">
              <span className="inline-flex justify-center items-center bg-primary-50 rounded-sm size-6 text-primary-800 shrink-0">
                <Sparkles size={14} strokeWidth={1.75} />
              </span>
              <div className="flex flex-col items-start gap-1.5 min-w-0">
                <p className="text-landing-small text-neutral-900">{message.text}</p>
                {message.sourceLink && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-landing-small text-primary-800">
                    {message.sourceLink}
                    <ExternalLink size={14} strokeWidth={1.75} className="flip-rtl" />
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <p className="text-landing-caption text-neutral-600">{chat.disclaimer}</p>
    </Card>
  );
}

const SUMMARY: { key: "strengths" | "weaknesses" | "suggestions"; icon: LucideIcon; tone: ChipTone }[] = [
  { key: "strengths", icon: CircleCheck, tone: "green" },
  { key: "weaknesses", icon: TriangleAlert, tone: "amber" },
  { key: "suggestions", icon: Lightbulb, tone: "neutral" },
];

/** Small essay feedback summary: title, version, and counts as compact chips. */
function EssaySummaryCard({ className }: { className?: string }) {
  const { essay } = content.aiGuidance.preview;

  return (
    <Card floating className={cn("flex flex-col gap-2 p-3.5 lg:p-3.5", className)}>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex justify-center items-center bg-primary-50 rounded-sm size-7 text-primary-800 shrink-0">
          <FileText size={16} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-landing-small text-neutral-900">{essay.title}</p>
          <p className="text-landing-caption text-neutral-600">{essay.meta}</p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {SUMMARY.map(({ key, icon: Icon, tone }) => (
          <li key={key}>
            <Chip tone={tone} className="px-2">
              <Icon size={12} strokeWidth={2} className="shrink-0" />
              {essay[key]}
            </Chip>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * AI guidance preview: the chat card (full column width, max 520px, at the inline-start) with a
 * small essay feedback card overlapping its bottom corner at the inline-end. Both sit in a
 * wrapper capped at the chat card's width, so "inline-end" is the chat card's edge at every size.
 *  - From 768px: the small card overlaps the chat card's bottom by 48px and hangs 82px below it,
 *    reaching 32px past its inline-end edge (12px below 1024px). FeatureSection adds 96px of
 *    bottom padding so it never reaches the next section.
 *  - Below 768px: the small card is in normal flow under the chat card, pulled up 20px over it,
 *    aligned to the inline-end.
 */
function AiGuidancePreview() {
  return (
    <div className="relative w-full max-w-130">
      {/*
        * From 768px the summary card (130px tall: header + two rows of chips) tucks 48px up into
        * the chat card and hangs 82px below it. The chat card's bottom padding is the 48px plus
        * 12px, so the overlap only ever covers empty space. Update both if the summary grows.
        */}
      <ChatCard className="md:pb-15 lg:pb-15" />
      <EssaySummaryCard className="z-10 relative md:absolute -mt-5 md:mt-0 ms-auto w-65 max-w-full md:-bottom-[82px] md:-end-3 lg:-end-8" />
    </div>
  );
}

/** Section 6: AI guidance, with the preview at the inline-start from 1024px (text stays first in the DOM). */
export function AiGuidanceSection({ id, tone }: { id: string; tone: SectionTone }) {
  const { aiGuidance } = content;
  return (
    <FeatureSection
      id={id}
      tone={tone}
      eyebrow={aiGuidance.eyebrow}
      title={aiGuidance.title}
      intro={aiGuidance.intro}
      points={aiGuidance.points}
      preview={<AiGuidancePreview />}
      previewLabel={aiGuidance.preview.label}
      previewClassName="md:pb-24"
      reversed
    />
  );
}
