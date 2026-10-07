// Education levels from the API only have names, no code or rank, so high school is detected by
// name. TODO: switch to a level code (e.g. `HIGH_SCHOOL`) once the backend provides one.
const HIGH_SCHOOL_KEYWORDS = ["high school", "secondary", "tawjihi"];

export function isHighSchoolLevel(levelName?: string): boolean {
  const name = levelName?.toLowerCase() ?? "";
  return HIGH_SCHOOL_KEYWORDS.some((keyword) => name.includes(keyword));
}
