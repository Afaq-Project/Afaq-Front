import { daysUntil } from "@/src/shared/lib/deadline";
import type { SectionTone } from "../../../constants";
import { PUBLIC_SCHOLARSHIPS } from "../../../data/scholarships";
import { getOpenScholarships } from "../../../services/openScholarships";
import { Section } from "../../layout/Section";
import { ScholarshipsBrowser, type ScholarshipItem } from "./ScholarshipsBrowser";

const TITLE_ID = "scholarships-title";

/**
 * Open scholarships, no match scores: live ones from the API when any are open, otherwise the
 * examples. Days left are computed here on the server, so the client never recomputes them from
 * its own clock (no hydration mismatch around midnight or across time zones). Sorted
 * soonest-closing first.
 */
export async function ScholarshipsSection({ id, tone }: { id: string; tone: SectionTone }) {
  const now = new Date();
  const live = await getOpenScholarships(now);
  const items: ScholarshipItem[] = live.length > 0 ? live : PUBLIC_SCHOLARSHIPS.map((scholarship) => ({
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
