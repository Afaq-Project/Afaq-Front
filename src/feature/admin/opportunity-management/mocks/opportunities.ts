import { ManagedOpportunity } from "../types/opportunity";

export const MANAGED_OPPORTUNITIES: ManagedOpportunity[] = [
  {
    id: "1",
    title: "Global Excellence Scholarship",
    type: "Scholarship",
    provider: "Open Horizons Foundation",
    fieldsOfStudy: ["Engineering", "Computer Science"],
    description:
      "A merit-based award covering full tuition and a living stipend for undergraduate students pursuing STEM degrees at partner universities across the GCC.",
    eligibility:
      "GCC nationals aged 18-24 with a minimum GPA of 3.5, enrolled or accepted into an accredited STEM program.",
    officialLink: "https://openhorizons.example.org/scholarships/global-excellence",
    deadline: "2026-11-02",
    unpublished: false,
  },
  {
    id: "2",
    title: "Product Design Internship",
    type: "Internship",
    provider: "Northwind Labs",
    fieldsOfStudy: ["Design", "Human-Computer Interaction"],
    description:
      "A 12-week paid internship embedded in Northwind Labs' product design team, working on end-to-end feature design for their consumer app.",
    eligibility:
      "Current undergraduate or graduate students in design, HCI, or a related field. Portfolio required.",
    officialLink: "https://northwindlabs.example.com/careers/product-design-intern",
    deadline: "2026-10-15",
    unpublished: false,
  },
  {
    id: "3",
    title: "Women in STEM Grant",
    type: "Scholarship",
    provider: "Beacon Trust",
    fieldsOfStudy: ["Physics", "Engineering", "Computer Science"],
    description:
      "A research grant supporting women pursuing postgraduate studies in engineering, physics, or computer science.",
    eligibility:
      "Women enrolled in or admitted to a postgraduate STEM program, with demonstrated financial need.",
    officialLink: "https://beacontrust.example.org/grants/women-in-stem",
    deadline: "2026-09-05",
    unpublished: false,
  },
  {
    id: "4",
    title: "Data Science Summer Internship",
    type: "Internship",
    provider: "Arcline Analytics",
    fieldsOfStudy: ["Data Science", "Statistics"],
    description:
      "Summer internship focused on building forecasting models and dashboards for Arcline's retail analytics clients.",
    eligibility:
      "Penultimate or final-year students in statistics, computer science, or a quantitative field. Python and SQL experience preferred.",
    officialLink: "https://arclineanalytics.example.com/internships/data-science",
    deadline: "2026-08-20",
    unpublished: false,
  },
  {
    id: "5",
    title: "Young Leaders Scholarship",
    type: "Scholarship",
    provider: "Arab Youth Empowerment Initiative",
    fieldsOfStudy: ["Public Policy", "Business Administration"],
    description:
      "Leadership development scholarship covering tuition and mentorship for students active in community organizing.",
    eligibility: "Applicants aged 18-22 with a record of community leadership or volunteer work.",
    officialLink: "https://ayei.example.org/scholarships/young-leaders",
    deadline: "2026-12-01",
    unpublished: false,
  },
  {
    id: "6",
    title: "Marketing Analytics Internship",
    type: "Internship",
    provider: "Growth Loop Agency",
    fieldsOfStudy: ["Marketing", "Business Administration"],
    description:
      "Hands-on internship analyzing campaign performance and building attribution reports for Growth Loop's client portfolio.",
    eligibility: "Students or recent graduates in marketing, business, or analytics. Excel/SQL familiarity a plus.",
    officialLink: "https://growthloop.example.com/careers/marketing-analytics-intern",
    deadline: "2026-09-10",
    unpublished: false,
  },
  {
    id: "7",
    title: "Renewable Energy Research Fellowship",
    type: "Scholarship",
    provider: "Gulf Renewable Energy Council",
    fieldsOfStudy: ["Mechanical Engineering", "Environmental Science"],
    description:
      "Fellowship funding a year of applied research into solar and wind energy storage solutions at a partner research center.",
    eligibility:
      "Graduate students in mechanical, electrical, or environmental engineering with a research proposal.",
    officialLink: "https://grec.example.org/fellowships/renewable-energy",
    deadline: "2026-11-20",
    unpublished: false,
  },
  {
    id: "8",
    title: "Applied AI Fellowship",
    type: "Scholarship",
    provider: "Applied AI Collective",
    fieldsOfStudy: ["Computer Science", "Data Science"],
    description:
      "A one-year fellowship for early-career researchers building applied machine learning systems with regional industry partners.",
    eligibility:
      "Recent graduates or final-year students in computer science or a related field with a portfolio of ML projects.",
    officialLink: "https://appliedaicollective.example.org/fellowships/applied-ai",
    deadline: "2026-08-16",
    unpublished: false,
  },
  {
    id: "9",
    title: "Public Policy Internship",
    type: "Internship",
    provider: "Regional Policy Institute",
    fieldsOfStudy: ["Public Policy", "Political Science"],
    description:
      "Internship supporting policy research and briefing preparation for the institute's regional governance program.",
    eligibility: "Undergraduate or graduate students in political science, public policy, or a related field.",
    officialLink: "https://regionalpolicy.example.org/internships/public-policy",
    deadline: "2026-10-01",
    unpublished: true,
  },
  {
    id: "10",
    title: "Future Engineers Scholarship",
    type: "Scholarship",
    provider: "Emirates Engineering Trust",
    fieldsOfStudy: ["Civil Engineering", "Engineering"],
    description:
      "Scholarship covering tuition and equipment costs for undergraduate engineering students with a project-based portfolio.",
    eligibility: "Undergraduate engineering students with a GPA of 3.0 or higher.",
    officialLink: "https://eet.example.org/scholarships/future-engineers",
    deadline: "2026-12-15",
    unpublished: false,
  },
  {
    id: "11",
    title: "Creative Arts Internship",
    type: "Internship",
    provider: "Studio Nawafir",
    fieldsOfStudy: ["Fine Arts", "Design"],
    description:
      "Studio-based internship supporting visual design and installation work for Studio Nawafir's exhibition programme.",
    eligibility: "Students or recent graduates in fine arts, design, or a related creative field.",
    officialLink: "https://studionawafir.example.com/opportunities/creative-arts-intern",
    deadline: "2026-09-01",
    unpublished: false,
  },
  {
    id: "12",
    title: "UX Research Internship",
    type: "Internship",
    provider: "Northwind Labs",
    fieldsOfStudy: ["Human-Computer Interaction", "Psychology"],
    description:
      "Internship supporting user research studies and usability testing across Northwind Labs' product lines.",
    eligibility: "Students in HCI, psychology, or a related field with prior research methods coursework.",
    officialLink: "https://northwindlabs.example.com/careers/ux-research-intern",
    deadline: "2026-10-25",
    unpublished: false,
  },
];
