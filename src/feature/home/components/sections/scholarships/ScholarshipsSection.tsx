import { daysUntil } from "@/src/shared/lib/deadline";
import type { SectionTone } from "../../../constants";
import { PUBLIC_SCHOLARSHIPS } from "../../../data/scholarships";
import { Section } from "../../layout/Section";
import { ScholarshipsBrowser, type ScholarshipItem } from "./ScholarshipsBrowser";

const TITLE_ID = "scholarships-title";

/**
 * Open scholarships: a public showcase of example scholarships, no match scores. Days left are
 * computed here on the server, so the client never recomputes them from its own clock (no
 * hydration mismatch around midnight or across time zones). Sorted soonest-closing first.
 */
export function ScholarshipsSection({ id, tone }: { id: string; tone: SectionTone }) {
  const now = new Date();
  const items: ScholarshipItem[] = PUBLIC_SCHOLARSHIPS.map((scholarship) => ({
    ...scholarship,
    daysLeft: daysUntil(scholarship.deadline, now),
  }))
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID}>
      <ScholarshipsBrowser items={items} titleId={TITLE_ID} />
    </Section>
  );
}
