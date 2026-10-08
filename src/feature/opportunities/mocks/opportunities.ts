import { OpportunityDetail, OpportunitySummary } from "../types/opportunity";

// Full opportunity catalog, browsed on the Discover page (FR-3.x) and
// sampled from on the dashboard's "best opportunities" preview.
export const OPPORTUNITIES: OpportunitySummary[] = [
  {
    id: "o1",
    title: "Qatar Foundation Academic Excellence Scholarship",
    description:
      "Comprehensive scholarship for outstanding students pursuing degrees in science and engineering.",
    type: "Scholarship",
    matchScore: 98,
    daysLeft: 12,
    location: "Doha, Qatar",
    countryCode: "qa",
    fieldOfStudy: "Engineering",
    provider: "Qatar Foundation",
    fundingStatus: "Fully Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "strong", language: "strong", experience: "strong" },
  },
  {
    id: "o2",
    title: "Product Design Internship",
    description:
      "Work alongside senior product designers shipping consumer-facing experiences.",
    type: "Internship",
    matchScore: 82,
    daysLeft: 5,
    location: "Riyadh, Saudi Arabia",
    countryCode: "sa",
    fieldOfStudy: "Design",
    provider: "Northwind Labs",
    fundingStatus: "Paid",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "partial", language: "strong", experience: "partial" },
  },
  {
    id: "o3",
    title: "Young Leaders Scholarship 2024",
    description:
      "International program empowering Arab youth in leadership and social impact.",
    type: "Scholarship",
    matchScore: 89,
    daysLeft: 30,
    location: "Dubai, UAE",
    countryCode: "ae",
    fieldOfStudy: "Business",
    provider: "Arab Youth Empowerment Initiative",
    fundingStatus: "Fully Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "strong", language: "partial", experience: "strong" },
  },
  {
    id: "o4",
    title: "Data Science Summer Internship",
    description:
      "Hands-on internship building data pipelines and ML models for real products.",
    type: "Internship",
    matchScore: 91,
    daysLeft: 18,
    location: "Cairo, Egypt",
    countryCode: "eg",
    fieldOfStudy: "Computer Science",
    provider: "Arcline Analytics",
    fundingStatus: "Paid",
    level: "Bachelor's",
    isRemote: true,
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "partial", language: "strong", experience: "strong" },
  },
  {
    id: "o5",
    title: "Frontier Research Scholarship",
    description:
      "Fully funded scholarship for early-career researchers in applied physics.",
    type: "Scholarship",
    matchScore: 76,
    daysLeft: 45,
    location: "Amman, Jordan",
    countryCode: "jo",
    fieldOfStudy: "Physics",
    provider: "Meridian Institute",
    fundingStatus: "Fully Funded",
    level: "Master's",
    matchFactors: { fieldOfStudy: "strong", skills: "partial", gpa: "strong", language: "partial", experience: "partial" },
  },
  {
    id: "o6",
    title: "Women in STEM Grant",
    description:
      "Grant supporting women pursuing graduate studies in STEM fields.",
    type: "Scholarship",
    matchScore: 68,
    daysLeft: 3,
    location: "Beirut, Lebanon",
    countryCode: "lb",
    fieldOfStudy: "Computer Science",
    provider: "Beacon Trust",
    fundingStatus: "Partially Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "partial", gpa: "partial", language: "partial", experience: "missing" },
  },
  {
    id: "o7",
    title: "Global Health Scholarship",
    description:
      "Scholarship placing graduates with NGOs tackling public health challenges.",
    type: "Scholarship",
    matchScore: 64,
    daysLeft: 60,
    location: "Amman, Jordan",
    countryCode: "jo",
    fieldOfStudy: "Medicine",
    provider: "WHO Regional Office",
    fundingStatus: "Fully Funded",
    level: "Master's",
    matchFactors: { fieldOfStudy: "partial", skills: "partial", gpa: "strong", language: "partial", experience: "missing" },
  },
  {
    id: "o8",
    title: "Marketing Analytics Internship",
    description:
      "Support growth campaigns with data-driven marketing insights and reporting.",
    type: "Internship",
    matchScore: 71,
    daysLeft: 21,
    location: "Doha, Qatar",
    countryCode: "qa",
    fieldOfStudy: "Business",
    provider: "Growth Loop Agency",
    fundingStatus: "Paid",
    isRemote: true,
  },
  {
    id: "o9",
    title: "Middle East Legal Studies Scholarship",
    description:
      "Scholarship for students pursuing law degrees with a regional policy focus.",
    type: "Scholarship",
    matchScore: 58,
    daysLeft: 75,
    location: "Cairo, Egypt",
    countryCode: "eg",
    fieldOfStudy: "Law",
    provider: "Levant Legal Foundation",
    fundingStatus: "Partially Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "partial", skills: "missing", gpa: "partial", language: "strong", experience: "missing" },
    meetsRequirements: false,
  },
  {
    id: "o10",
    title: "Renewable Energy Research Scholarship",
    description:
      "Fund graduate research into solar and wind energy systems for the region.",
    type: "Scholarship",
    matchScore: 85,
    daysLeft: 40,
    location: "Riyadh, Saudi Arabia",
    countryCode: "sa",
    fieldOfStudy: "Engineering",
    provider: "Gulf Renewable Energy Council",
    fundingStatus: "Fully Funded",
    level: "Master's",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "partial", language: "strong", experience: "partial" },
  },
  {
    id: "o11",
    title: "Creative Arts Internship",
    description:
      "Assist a regional studio on brand campaigns spanning film, print, and digital.",
    type: "Internship",
    matchScore: 60,
    daysLeft: 9,
    location: "Beirut, Lebanon",
    countryCode: "lb",
    fieldOfStudy: "Arts",
    provider: "Studio Nawafir",
    fundingStatus: "Unpaid",
    matchFactors: { fieldOfStudy: "partial", skills: "partial", gpa: "partial", language: "strong", experience: "missing" },
  },
  {
    id: "o12",
    title: "Future Engineers Scholarship",
    description:
      "Merit-based scholarship covering full tuition for undergraduate engineering students.",
    type: "Scholarship",
    matchScore: 94,
    daysLeft: 27,
    location: "Dubai, UAE",
    countryCode: "ae",
    fieldOfStudy: "Engineering",
    provider: "Emirates Engineering Trust",
    fundingStatus: "Fully Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "strong", language: "strong", experience: "partial" },
  },
  {
    id: "o13",
    title: "Applied AI Scholarship",
    description:
      "Twelve-month scholarship building applied machine learning products with mentors.",
    type: "Scholarship",
    matchScore: 88,
    daysLeft: 15,
    location: "Cairo, Egypt",
    countryCode: "eg",
    fieldOfStudy: "Computer Science",
    provider: "Applied AI Collective",
    fundingStatus: "Fully Funded",
    level: "PhD",
    matchFactors: { fieldOfStudy: "strong", skills: "strong", gpa: "partial", language: "strong", experience: "strong" },
  },
  {
    id: "o14",
    title: "Public Policy Internship",
    description:
      "Contribute to research briefs supporting regional public policy initiatives.",
    type: "Internship",
    matchScore: 55,
    daysLeft: 34,
    location: "Amman, Jordan",
    countryCode: "jo",
    fieldOfStudy: "Business",
    provider: "Regional Policy Institute",
    fundingStatus: "Paid",
    isRemote: true,
    meetsRequirements: false,
  },
  {
    id: "o15",
    title: "Gulf Women in Tech Scholarship",
    description:
      "Partial tuition support for women studying computer science at a Gulf university.",
    type: "Scholarship",
    matchScore: 73,
    // Closed four days ago: Discover still lists recently closed ones, dimmed.
    daysLeft: -4,
    location: "Manama, Bahrain",
    countryCode: "bh",
    fieldOfStudy: "Computer Science",
    provider: "Gulf Tech Foundation",
    fundingStatus: "Partially Funded",
    level: "Bachelor's",
    matchFactors: { fieldOfStudy: "strong", skills: "partial", gpa: "strong", language: "strong", experience: "missing" },
  },
];

// Highest matches that are still open, for the dashboard.
export const RECOMMENDED_OPPORTUNITIES: OpportunitySummary[] = OPPORTUNITIES.filter((o) => o.daysLeft >= 0)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 4);

// Extra fields shown on the opportunity details page, keyed by id. Kept
// separate from OPPORTUNITIES so the summary catalog stays the single
// source of truth for title/description/etc.
// deadlineDate is derived from each summary's daysLeft (below), so it isn't listed per entry.
type DetailExtras = Omit<OpportunityDetail, keyof OpportunitySummary | "deadlineDate">;

/** ISO date (YYYY-MM-DD) `days` from today, in local time, so mock deadlines never go stale. */
function isoDateFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DETAIL_EXTRAS: Record<string, DetailExtras> = {
  o1: {
    keywords: ["STEM", "Undergraduate", "Full Tuition", "Qatar"],
    providerUrl: "https://example.com/providers/o1",
    sourceUrl: "https://listings.example.org/opportunities/o1",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o1/apply",
    eligibility: [
      { text: "Enrolled or admitted to an accredited undergraduate program", userFit: "met" },
      { text: "Minimum GPA of 3.5 or equivalent", userFit: "met" },
      { text: "Majoring in a STEM field", userFit: "met" },
      { text: "Open to applicants from any nationality", userFit: "met" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
      { name: "Two letters of recommendation", category: "recommendation" },
      { name: "Passport copy" },
    ],
  },
  o2: {
    keywords: ["UX/UI", "Consumer Product", "Design Systems"],
    providerUrl: "https://example.com/providers/o2",
    sourceUrl: "https://listings.example.org/opportunities/o2",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o2/apply",
    eligibility: [
      { text: "Currently pursuing a degree in Design, HCI, or a related field", userFit: "met" },
      { text: "Proficiency with Figma or similar design tools", userFit: "met" },
      { text: "Available for a 3-month on-site placement", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Portfolio" },
      { name: "Cover letter" },
    ],
  },
  o3: {
    keywords: ["Leadership", "Social Impact", "MENA"],
    providerUrl: "https://example.com/providers/o3",
    sourceUrl: "https://listings.example.org/opportunities/o3",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o3/apply",
    eligibility: [
      { text: "Aged 18-29 at the time of application", userFit: "met" },
      { text: "Demonstrated leadership or community involvement", userFit: "met" },
      { text: "Fluent in English and Arabic", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o4: {
    keywords: ["Machine Learning", "Data Pipelines", "Python"],
    providerUrl: "https://example.com/providers/o4",
    sourceUrl: "https://listings.example.org/opportunities/o4",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o4/apply",
    eligibility: [
      { text: "Pursuing a degree in Computer Science, Data Science, or a related field", userFit: "met" },
      { text: "Working knowledge of Python and SQL", userFit: "met" },
      { text: "Available for a 10-week summer placement", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Cover letter" },
      { name: "Portfolio" },
    ],
  },
  o5: {
    keywords: ["Applied Physics", "Research", "Fully Funded"],
    providerUrl: "https://example.com/providers/o5",
    sourceUrl: "https://listings.example.org/opportunities/o5",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o5/apply",
    eligibility: [
      { text: "PhD or equivalent research experience in Physics", userFit: "met" },
      { text: "Published or in-progress research relevant to applied physics", userFit: "met" },
      { text: "Available to relocate to Amman for the scholarship term", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Research proposal" },
      { name: "Two letters of recommendation", category: "recommendation" },
      { name: "Academic transcripts", category: "transcript" },
    ],
  },
  o6: {
    keywords: ["STEM", "Women in Tech", "Graduate Studies"],
    providerUrl: "https://example.com/providers/o6",
    sourceUrl: "https://listings.example.org/opportunities/o6",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o6/apply",
    eligibility: [
      { text: "Identifies as a woman pursuing graduate studies", userFit: "met" },
      { text: "Enrolled in a STEM graduate program", userFit: "met" },
      { text: "Demonstrated financial need", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o7: {
    keywords: ["Public Health", "NGO", "Global Health"],
    providerUrl: "https://example.com/providers/o7",
    sourceUrl: "https://listings.example.org/opportunities/o7",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o7/apply",
    eligibility: [
      { text: "Recent graduate in Medicine, Public Health, or a related field", userFit: "met" },
      { text: "Willingness to relocate for a 12-month placement", userFit: "met" },
      { text: "Prior volunteer or NGO experience preferred", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Research proposal" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o8: {
    keywords: ["Marketing", "Analytics", "Growth"],
    providerUrl: "https://example.com/providers/o8",
    sourceUrl: "https://listings.example.org/opportunities/o8",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o8/apply",
    eligibility: [
      { text: "Pursuing a degree in Marketing, Business, or Analytics" },
      { text: "Familiarity with analytics platforms (e.g. Google Analytics)" },
      { text: "Available for a 6-month placement" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Cover letter" },
    ],
  },
  o9: {
    keywords: ["Law", "Public Policy", "MENA"],
    providerUrl: "https://example.com/providers/o9",
    sourceUrl: "https://listings.example.org/opportunities/o9",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o9/apply",
    eligibility: [
      { text: "Enrolled in or admitted to a Law degree program", userFit: "met" },
      { text: "Interest in regional policy and governance", userFit: "not_met" },
      { text: "Strong academic record in prior legal studies", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o10: {
    keywords: ["Renewable Energy", "Clean Tech", "Graduate Research"],
    providerUrl: "https://example.com/providers/o10",
    sourceUrl: "https://listings.example.org/opportunities/o10",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o10/apply",
    eligibility: [
      { text: "Graduate student or researcher in Engineering or Energy Sciences", userFit: "met" },
      { text: "Research focus on solar, wind, or related renewable systems", userFit: "met" },
      { text: "Available for the full scholarship duration", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Research proposal" },
      { name: "Two letters of recommendation", category: "recommendation" },
      { name: "Academic transcripts", category: "transcript" },
    ],
  },
  o11: {
    keywords: ["Branding", "Film & Print", "Creative"],
    officialLink: "https://example.com/opportunities/o11/apply",
    eligibility: [
      { text: "Portfolio demonstrating work in film, print, or digital media" },
      { text: "Currently enrolled in or a graduate of an Arts program" },
      { text: "Based in or able to relocate to Beirut" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Portfolio" },
      { name: "Cover letter" },
    ],
  },
  o12: {
    keywords: ["Engineering", "Full Tuition", "Merit-Based"],
    providerUrl: "https://example.com/providers/o12",
    sourceUrl: "https://listings.example.org/opportunities/o12",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o12/apply",
    eligibility: [
      { text: "Admitted undergraduate in an Engineering program", userFit: "met" },
      { text: "Minimum GPA of 3.7", userFit: "met" },
      { text: "Demonstrated financial need or merit qualification", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o13: {
    keywords: ["Machine Learning", "Applied AI", "Mentorship"],
    providerUrl: "https://example.com/providers/o13",
    sourceUrl: "https://listings.example.org/opportunities/o13",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o13/apply",
    eligibility: [
      { text: "Background in Computer Science, ML, or a related quantitative field", userFit: "met" },
      { text: "Practical experience with ML frameworks (PyTorch/TensorFlow)", userFit: "met" },
      { text: "Available for the full 12-month term", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Research proposal" },
      { name: "Two letters of recommendation", category: "recommendation" },
    ],
  },
  o14: {
    keywords: ["Public Policy", "Research Briefs", "Government"],
    officialLink: "https://example.com/opportunities/o14/apply",
    eligibility: [
      { text: "Pursuing a degree in Public Policy, Business, or a related field", userFit: "met" },
      { text: "Strong research and writing skills", userFit: "not_met" },
      { text: "Available for a 6-month placement", userFit: "unknown" },
    ],
    requiredDocuments: [
      { name: "CV / resume", category: "resume" },
      { name: "Cover letter" },
    ],
  },
  o15: {
    keywords: ["Women in STEM", "Computer Science", "Partial Tuition"],
    providerUrl: "https://example.com/providers/o15",
    sourceUrl: "https://listings.example.org/opportunities/o15",
    lastCheckedAt: "2026-10-06",
    officialLink: "https://example.com/opportunities/o15/apply",
    eligibility: [
      { text: "Women enrolled in a computer science or related bachelor's program", userFit: "met" },
      { text: "Studying at a university in a Gulf Cooperation Council country", userFit: "met" },
    ],
    requiredDocuments: [
      { name: "Academic transcripts", category: "transcript" },
      { name: "Personal statement", category: "essay" },
    ],
  },
};

// Provider and funding moved onto the summaries (the cards show them); details still require both.
export const OPPORTUNITY_DETAILS: OpportunityDetail[] = OPPORTUNITIES.map((opportunity) => {
  const { provider, fundingStatus } = opportunity;
  if (!provider || !fundingStatus) {
    throw new Error(`Mock opportunity ${opportunity.id} needs a provider and a funding status`);
  }
  return {
    ...opportunity,
    provider,
    fundingStatus,
    // TODO: the API should send the deadline date; daysLeft should then be computed from it everywhere.
    deadlineDate: isoDateFromToday(opportunity.daysLeft),
    ...DETAIL_EXTRAS[opportunity.id],
  };
});
