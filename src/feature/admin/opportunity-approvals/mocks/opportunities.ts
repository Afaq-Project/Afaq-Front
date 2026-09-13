import { OpportunitySubmission } from "../types/opportunity";

export const OPPORTUNITIES: OpportunitySubmission[] = [
  {
    id: "1",
    title: "Global Excellence Scholarship",
    provider: "Open Horizons Foundation",
    type: "Scholarship",
    source: "Mawhiba Portal",
    sourceUrl: "https://mawhiba.example.org/scholarships/global-excellence",
    deadline: "2026-11-02",
    dateScraped: "2026-09-08",
    description:
      "A merit-based award covering full tuition and a living stipend for undergraduate students pursuing STEM degrees at partner universities across the GCC.",
    eligibility:
      "Open to GCC nationals aged 18-24 with a minimum GPA of 3.5, enrolled or accepted into an accredited STEM program.",
  },
  {
    id: "2",
    title: "Global Excellence Scholarship Programme",
    provider: "Open Horizons Foundation",
    type: "Scholarship",
    source: "Scholarship.gov",
    sourceUrl: "https://scholarships.gov.example/listings/global-excellence-programme",
    deadline: "2026-11-02",
    dateScraped: "2026-09-09",
    description:
      "Full tuition and stipend award for undergraduate STEM students, sponsored by the Open Horizons Foundation in partnership with regional universities.",
    eligibility:
      "GCC nationals, 18-24 years old, GPA 3.5 or higher, enrolled in a STEM program.",
    duplicateOf: {
      title: "Global Excellence Scholarship",
      provider: "Open Horizons Foundation",
      matchedOn: ["title", "provider", "deadline"],
    },
  },
  {
    id: "3",
    title: "Product Design Internship",
    provider: "Northwind Labs",
    type: "Internship",
    source: "LinkedIn Jobs",
    sourceUrl: "https://linkedin.example.com/jobs/product-design-internship-northwind",
    deadline: "2026-10-15",
    dateScraped: "2026-09-07",
    description:
      "A 12-week paid internship embedded in Northwind Labs' product design team, working on end-to-end feature design for their consumer app.",
    eligibility:
      "Current undergraduate or graduate students in design, HCI, or a related field. Portfolio required.",
  },
  {
    id: "4",
    title: "Data Science Summer Internship",
    provider: "Arcline Analytics",
    type: "Internship",
    source: "Internships.com",
    sourceUrl: "https://internships.example.com/listings/arcline-data-science",
    deadline: "2026-10-20",
    dateScraped: "2026-09-06",
    description:
      "Summer internship focused on building forecasting models and dashboards for Arcline's retail analytics clients.",
    eligibility:
      "Penultimate or final-year students in statistics, computer science, or a quantitative field. Python and SQL experience preferred.",
  },
  {
    id: "5",
    title: "Women in STEM Grant",
    provider: "Beacon Trust",
    type: "Scholarship",
    source: "Chevening Scholarships",
    sourceUrl: "https://chevening.example.org/grants/women-in-stem",
    deadline: "2026-10-01",
    dateScraped: "2026-09-05",
    description:
      "A research grant supporting women pursuing postgraduate studies in engineering, physics, or computer science.",
    eligibility:
      "Women enrolled in or admitted to a postgraduate STEM program, with demonstrated financial need.",
  },
  {
    id: "6",
    title: "Young Leaders Scholarship",
    provider: "Arab Youth Empowerment Initiative",
    type: "Scholarship",
    source: "Mawhiba Portal",
    sourceUrl: "https://mawhiba.example.org/scholarships/young-leaders",
    deadline: "2026-12-01",
    dateScraped: "2026-09-08",
    description:
      "Leadership development scholarship covering tuition and mentorship for students active in community organizing.",
    eligibility:
      "Applicants aged 18-22 with a record of community leadership or volunteer work.",
  },
  {
    id: "7",
    title: "Marketing Analytics Internship",
    provider: "Growth Loop Agency",
    type: "Internship",
    source: "LinkedIn Jobs",
    sourceUrl: "https://linkedin.example.com/jobs/marketing-analytics-growth-loop",
    deadline: "2026-10-10",
    dateScraped: "2026-09-04",
    description:
      "Hands-on internship analyzing campaign performance and building attribution reports for Growth Loop's client portfolio.",
    eligibility:
      "Students or recent graduates in marketing, business, or analytics. Excel/SQL familiarity a plus.",
  },
  {
    id: "8",
    title: "Renewable Energy Research Fellowship",
    provider: "Gulf Renewable Energy Council",
    type: "Scholarship",
    source: "Scholarship.gov",
    sourceUrl: "https://scholarships.gov.example/listings/renewable-energy-fellowship",
    deadline: "2026-11-20",
    dateScraped: "2026-09-03",
    description:
      "Fellowship funding a year of applied research into solar and wind energy storage solutions at a partner research center.",
    eligibility:
      "Graduate students in mechanical, electrical, or environmental engineering with a research proposal.",
  },
  {
    id: "9",
    title: "Applied AI Fellowship",
    provider: "Applied AI Collective",
    type: "Scholarship",
    source: "Chevening Scholarships",
    sourceUrl: "https://chevening.example.org/fellowships/applied-ai",
    deadline: "2026-11-15",
    dateScraped: "2026-09-09",
    description:
      "A one-year fellowship for early-career researchers building applied machine learning systems with regional industry partners.",
    eligibility:
      "Recent graduates or final-year students in computer science or a related field with a portfolio of ML projects.",
  },
  {
    id: "10",
    title: "Applied Artificial Intelligence Fellowship",
    provider: "Applied AI Collective",
    type: "Scholarship",
    source: "Internships.com",
    sourceUrl: "https://internships.example.com/listings/applied-ai-fellowship",
    deadline: "2026-11-18",
    dateScraped: "2026-09-10",
    description:
      "Year-long fellowship pairing early-career ML researchers with industry mentors across the region.",
    eligibility:
      "Final-year students or recent graduates in CS, data science, or a related field.",
    duplicateOf: {
      title: "Applied AI Fellowship",
      provider: "Applied AI Collective",
      matchedOn: ["title", "provider"],
    },
  },
];
