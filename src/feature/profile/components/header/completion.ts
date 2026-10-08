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

// TODO: provide the next step (e.g. { label: "Add your GPA", impact: "Counts for 20% of your
// match score", href: "#education" }) once the API reports what's missing and how each field is
// weighted. Shared by the profile header and the dashboard so they always suggest the same thing.
export const PROFILE_NEXT_STEP: NextStep | undefined = undefined;
