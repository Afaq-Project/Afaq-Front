/** The single most useful thing to add next, e.g. "Add your GPA". */
export interface NextStep {
  label: string;
  /** Why it matters, e.g. "Counts for 20% of your match score". */
  impact: string;
  /** Anchor of the field to jump to, e.g. "#education". */
  href: string;
}

/** One of the factors that make up the match score, and whether the profile has it. */
export interface MatchFactor {
  key: string;
  label: string;
  complete: boolean;
  /** Anchor of the field to jump to. */
  href: string;
}
