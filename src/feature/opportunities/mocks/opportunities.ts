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
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop",
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
type DetailExtras = Omit<OpportunityDetail, keyof OpportunitySummary>;

const DETAIL_EXTRAS: Record<string, DetailExtras> = {
  o1: {
    keywords: ["STEM", "Undergraduate", "Full Tuition", "Qatar"],
    deadlineDate: "2026-09-17",
    officialLink: "https://example.com/opportunities/o1/apply",
    matchBreakdown: [
      { label: "Field of study", score: 99 },
      { label: "Academic profile", score: 97 },
      { label: "Eligibility", score: 100 },
      { label: "Location fit", score: 96 },
    ],
    eligibility: [
      "Enrolled or admitted to an accredited undergraduate program",
      "Minimum GPA of 3.5 or equivalent",
      "Majoring in a STEM field",
      "Open to applicants from any nationality",
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Personal statement",
      "Two letters of recommendation",
      "Passport copy",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o2: {
    keywords: ["UX/UI", "Consumer Product", "Design Systems"],
    deadlineDate: "2026-09-10",
    officialLink: "https://example.com/opportunities/o2/apply",
    matchBreakdown: [
      { label: "Field of study", score: 85 },
      { label: "Academic profile", score: 80 },
      { label: "Eligibility", score: 90 },
      { label: "Location fit", score: 73 },
    ],
    eligibility: [
      "Currently pursuing a degree in Design, HCI, or a related field",
      "Proficiency with Figma or similar design tools",
      "Available for a 3-month on-site placement",
    ],
    requiredDocuments: ["CV / resume", "Portfolio", "Cover letter"],
    gallery: [],
  },
  o3: {
    keywords: ["Leadership", "Social Impact", "MENA"],
    deadlineDate: "2026-10-05",
    officialLink: "https://example.com/opportunities/o3/apply",
    matchBreakdown: [
      { label: "Field of study", score: 92 },
      { label: "Academic profile", score: 90 },
      { label: "Eligibility", score: 85 },
      { label: "Location fit", score: 89 },
    ],
    eligibility: [
      "Aged 18-29 at the time of application",
      "Demonstrated leadership or community involvement",
      "Fluent in English and Arabic",
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Personal statement",
      "Two letters of recommendation",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o4: {
    keywords: ["Machine Learning", "Data Pipelines", "Python"],
    deadlineDate: "2026-09-23",
    officialLink: "https://example.com/opportunities/o4/apply",
    matchBreakdown: [
      { label: "Field of study", score: 95 },
      { label: "Academic profile", score: 90 },
      { label: "Eligibility", score: 88 },
      { label: "Location fit", score: 91 },
    ],
    eligibility: [
      "Pursuing a degree in Computer Science, Data Science, or a related field",
      "Working knowledge of Python and SQL",
      "Available for a 10-week summer placement",
    ],
    requiredDocuments: ["CV / resume", "Cover letter", "Portfolio"],
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o5: {
    keywords: ["Applied Physics", "Research", "Fully Funded"],
    deadlineDate: "2026-10-20",
    officialLink: "https://example.com/opportunities/o5/apply",
    matchBreakdown: [
      { label: "Field of study", score: 80 },
      { label: "Academic profile", score: 74 },
      { label: "Eligibility", score: 70 },
      { label: "Location fit", score: 80 },
    ],
    eligibility: [
      "PhD or equivalent research experience in Physics",
      "Published or in-progress research relevant to applied physics",
      "Available to relocate to Amman for the scholarship term",
    ],
    requiredDocuments: [
      "CV / resume",
      "Research proposal",
      "Two letters of recommendation",
      "Academic transcripts",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o6: {
    keywords: ["STEM", "Women in Tech", "Graduate Studies"],
    deadlineDate: "2026-09-08",
    officialLink: "https://example.com/opportunities/o6/apply",
    matchBreakdown: [
      { label: "Field of study", score: 72 },
      { label: "Academic profile", score: 65 },
      { label: "Eligibility", score: 60 },
      { label: "Location fit", score: 75 },
    ],
    eligibility: [
      "Identifies as a woman pursuing graduate studies",
      "Enrolled in a STEM graduate program",
      "Demonstrated financial need",
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Personal statement",
      "Two letters of recommendation",
    ],
    gallery: [],
  },
  o7: {
    keywords: ["Public Health", "NGO", "Global Health"],
    deadlineDate: "2026-11-04",
    officialLink: "https://example.com/opportunities/o7/apply",
    matchBreakdown: [
      { label: "Field of study", score: 68 },
      { label: "Academic profile", score: 60 },
      { label: "Eligibility", score: 55 },
      { label: "Location fit", score: 73 },
    ],
    eligibility: [
      "Recent graduate in Medicine, Public Health, or a related field",
      "Willingness to relocate for a 12-month placement",
      "Prior volunteer or NGO experience preferred",
    ],
    requiredDocuments: [
      "CV / resume",
      "Research proposal",
      "Two letters of recommendation",
    ],
    gallery: [],
  },
  o8: {
    keywords: ["Marketing", "Analytics", "Growth"],
    deadlineDate: "2026-09-26",
    officialLink: "https://example.com/opportunities/o8/apply",
    matchBreakdown: [
      { label: "Field of study", score: 75 },
      { label: "Academic profile", score: 68 },
      { label: "Eligibility", score: 65 },
      { label: "Location fit", score: 76 },
    ],
    eligibility: [
      "Pursuing a degree in Marketing, Business, or Analytics",
      "Familiarity with analytics platforms (e.g. Google Analytics)",
      "Available for a 6-month placement",
    ],
    requiredDocuments: ["CV / resume", "Cover letter"],
    gallery: [],
  },
  o9: {
    keywords: ["Law", "Public Policy", "MENA"],
    deadlineDate: "2026-11-19",
    officialLink: "https://example.com/opportunities/o9/apply",
    matchBreakdown: [
      { label: "Field of study", score: 62 },
      { label: "Academic profile", score: 55 },
      { label: "Eligibility", score: 50 },
      { label: "Location fit", score: 65 },
    ],
    eligibility: [
      "Enrolled in or admitted to a Law degree program",
      "Interest in regional policy and governance",
      "Strong academic record in prior legal studies",
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Personal statement",
      "Two letters of recommendation",
    ],
    gallery: [],
  },
  o10: {
    keywords: ["Renewable Energy", "Clean Tech", "Graduate Research"],
    deadlineDate: "2026-10-15",
    officialLink: "https://example.com/opportunities/o10/apply",
    matchBreakdown: [
      { label: "Field of study", score: 88 },
      { label: "Academic profile", score: 85 },
      { label: "Eligibility", score: 80 },
      { label: "Location fit", score: 87 },
    ],
    eligibility: [
      "Graduate student or researcher in Engineering or Energy Sciences",
      "Research focus on solar, wind, or related renewable systems",
      "Available for the full scholarship duration",
    ],
    requiredDocuments: [
      "CV / resume",
      "Research proposal",
      "Two letters of recommendation",
      "Academic transcripts",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o11: {
    keywords: ["Branding", "Film & Print", "Creative"],
    deadlineDate: "2026-09-14",
    officialLink: "https://example.com/opportunities/o11/apply",
    matchBreakdown: [
      { label: "Field of study", score: 65 },
      { label: "Academic profile", score: 58 },
      { label: "Eligibility", score: 55 },
      { label: "Location fit", score: 62 },
    ],
    eligibility: [
      "Portfolio demonstrating work in film, print, or digital media",
      "Currently enrolled in or a graduate of an Arts program",
      "Based in or able to relocate to Beirut",
    ],
    requiredDocuments: ["CV / resume", "Portfolio", "Cover letter"],
    gallery: [],
  },
  o12: {
    keywords: ["Engineering", "Full Tuition", "Merit-Based"],
    deadlineDate: "2026-10-02",
    officialLink: "https://example.com/opportunities/o12/apply",
    matchBreakdown: [
      { label: "Field of study", score: 96 },
      { label: "Academic profile", score: 95 },
      { label: "Eligibility", score: 90 },
      { label: "Location fit", score: 95 },
    ],
    eligibility: [
      "Admitted undergraduate in an Engineering program",
      "Minimum GPA of 3.7",
      "Demonstrated financial need or merit qualification",
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Personal statement",
      "Two letters of recommendation",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop",
    ],
  },
  o13: {
    keywords: ["Machine Learning", "Applied AI", "Mentorship"],
    deadlineDate: "2026-09-20",
    officialLink: "https://example.com/opportunities/o13/apply",
    matchBreakdown: [
      { label: "Field of study", score: 92 },
      { label: "Academic profile", score: 88 },
      { label: "Eligibility", score: 82 },
      { label: "Location fit", score: 90 },
    ],
    eligibility: [
      "Background in Computer Science, ML, or a related quantitative field",
      "Practical experience with ML frameworks (PyTorch/TensorFlow)",
      "Available for the full 12-month term",
    ],
    requiredDocuments: [
      "CV / resume",
      "Research proposal",
      "Two letters of recommendation",
    ],
    gallery: [],
  },
  o14: {
    keywords: ["Public Policy", "Research Briefs", "Government"],
    deadlineDate: "2026-10-09",
    officialLink: "https://example.com/opportunities/o14/apply",
    matchBreakdown: [
      { label: "Field of study", score: 60 },
      { label: "Academic profile", score: 52 },
      { label: "Eligibility", score: 48 },
      { label: "Location fit", score: 60 },
    ],
    eligibility: [
      "Pursuing a degree in Public Policy, Business, or a related field",
      "Strong research and writing skills",
      "Available for a 6-month placement",
    ],
    requiredDocuments: ["CV / resume", "Cover letter"],
    gallery: [],
  },
  o15: {
    keywords: ["Women in STEM", "Computer Science", "Partial Tuition"],
    deadlineDate: "2026-10-04",
    officialLink: "https://example.com/opportunities/o15/apply",
    matchBreakdown: [
      { label: "Field of study", score: 90 },
      { label: "Academic profile", score: 78 },
      { label: "Eligibility", score: 70 },
      { label: "Location fit", score: 55 },
    ],
    eligibility: [
      "Women enrolled in a computer science or related bachelor's program",
      "Studying at a university in a Gulf Cooperation Council country",
    ],
    requiredDocuments: ["Academic transcripts", "Personal statement"],
    gallery: [],
  },
};

// Provider and funding moved onto the summaries (the cards show them); details still require both.
export const OPPORTUNITY_DETAILS: OpportunityDetail[] = OPPORTUNITIES.map((opportunity) => {
  const { provider, fundingStatus } = opportunity;
  if (!provider || !fundingStatus) {
    throw new Error(`Mock opportunity ${opportunity.id} needs a provider and a funding status`);
  }
  return { ...opportunity, provider, fundingStatus, ...DETAIL_EXTRAS[opportunity.id] };
});
