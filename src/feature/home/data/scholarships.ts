import { isoDateFromToday } from "@/src/shared/lib/deadline";

export type Funding = "full" | "partial";
export type StudyLevel = "Bachelor's" | "Master's" | "PhD";

/**
 * A scholarship in the landing's showcase: an example below, or a live one from the API
 * (services/openScholarships), which only has the summary fields. The card leaves out what's missing.
 */
export interface PublicScholarship {
  id: string;
  title: string;
  provider?: string;
  /** ISO 3166-1 alpha-2, lowercase. Ignored when `isRemote`. */
  countryCode: string;
  isRemote: boolean;
  funding?: Funding;
  level?: StudyLevel;
  /** One sentence. */
  description?: string;
  /** ISO date (YYYY-MM-DD). */
  deadline: string;
  /** "Berlin, Germany" or "Remote". */
  location?: string;
  officialUrl?: string;
}

/*
 * Example open scholarships, shown when the API has no open scholarship to show (or can't be
 * reached). All fictional. Deadlines are set relative to today so the examples never expire.
 */
export const PUBLIC_SCHOLARSHIPS: PublicScholarship[] = [
  {
    id: "bright-horizons",
    title: "Bright Horizons Scholarship",
    provider: "Horizon Education Fund",
    countryCode: "de",
    isRemote: false,
    funding: "full",
    level: "Master's",
    description: "Covers tuition, housing, and travel for a two-year master's in any engineering field.",
    deadline: isoDateFromToday(2),
    location: "Berlin, Germany",
    officialUrl: "#",
  },
  {
    id: "coastal-science",
    title: "Coastal Science Scholarship",
    provider: "Lisbon Marine Institute",
    countryCode: "pt",
    isRemote: false,
    funding: "partial",
    level: "Master's",
    description: "Half of tuition for students in marine biology, oceanography, or coastal management.",
    deadline: isoDateFromToday(5),
    location: "Lisbon, Portugal",
    officialUrl: "#",
  },
  {
    id: "northern-lights",
    title: "Northern Lights Research Scholarship",
    provider: "Aurora Research Council",
    countryCode: "se",
    isRemote: false,
    funding: "full",
    level: "PhD",
    description: "A funded four-year doctoral position with a monthly stipend and research budget.",
    deadline: isoDateFromToday(9),
    location: "Stockholm, Sweden",
    officialUrl: "#",
  },
  {
    id: "open-classroom",
    title: "Open Classroom Scholarship",
    provider: "Global Learning Trust",
    countryCode: "",
    isRemote: true,
    funding: "partial",
    level: "Bachelor's",
    description: "Reduced tuition for an accredited online bachelor's you can study from home.",
    deadline: isoDateFromToday(14),
    location: "Remote",
    officialUrl: "#",
  },
  {
    id: "maple-leaf",
    title: "Maple Leaf Graduate Scholarship",
    provider: "Northfield University",
    countryCode: "ca",
    isRemote: false,
    funding: "full",
    level: "Master's",
    description: "Full tuition and a living allowance for international students in public health.",
    deadline: isoDateFromToday(21),
    location: "Toronto, Canada",
    officialUrl: "#",
  },
  {
    id: "rising-engineers",
    title: "Rising Engineers Scholarship",
    provider: "Kanto Institute of Technology",
    countryCode: "jp",
    isRemote: false,
    funding: "full",
    level: "Bachelor's",
    description: "Four years of tuition, a monthly stipend, and a year of Japanese language classes.",
    deadline: isoDateFromToday(30),
    location: "Tokyo, Japan",
    officialUrl: "#",
  },
  {
    id: "desert-bloom",
    title: "Desert Bloom Scholarship",
    provider: "Oasis Foundation",
    countryCode: "ae",
    isRemote: false,
    funding: "full",
    level: "Master's",
    description: "Fully funded study in renewable energy, with a summer placement at a partner lab.",
    deadline: isoDateFromToday(38),
    location: "Abu Dhabi, United Arab Emirates",
    officialUrl: "#",
  },
  {
    id: "alpine-innovation",
    title: "Alpine Innovation Scholarship",
    provider: "Helvetia Science Foundation",
    countryCode: "ch",
    isRemote: false,
    funding: "partial",
    level: "PhD",
    description: "A yearly stipend toward living costs for doctoral students in applied sciences.",
    deadline: isoDateFromToday(45),
    location: "Zurich, Switzerland",
    officialUrl: "#",
  },
  {
    id: "thames-leaders",
    title: "Thames Leaders Scholarship",
    provider: "London Civic Institute",
    countryCode: "gb",
    isRemote: false,
    funding: "full",
    level: "Master's",
    description: "Tuition, flights, and a stipend for a one-year master's in public policy.",
    deadline: isoDateFromToday(60),
    location: "London, United Kingdom",
    officialUrl: "#",
  },
];
