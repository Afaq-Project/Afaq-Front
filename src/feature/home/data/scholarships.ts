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
 * reached). All fictional, so they have no official site link. Deadlines are set relative to
 * today so the examples never expire.
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
  },
];

type ScholarshipCopy = Pick<PublicScholarship, "title" | "provider" | "description" | "location">;

/** The example scholarships' text in Arabic, by id. Fictional, like the English. */
const ARABIC_COPY: Record<string, ScholarshipCopy> = {
  "bright-horizons": {
    title: "منحة الآفاق المشرقة",
    provider: "صندوق هورايزن للتعليم",
    description: "تغطي الرسوم الدراسية والسكن والسفر لماجستير مدته سنتان في أي تخصص هندسي.",
    location: "برلين، ألمانيا",
  },
  "coastal-science": {
    title: "منحة علوم السواحل",
    provider: "معهد لشبونة البحري",
    description: "نصف الرسوم الدراسية لطلاب الأحياء البحرية أو علوم المحيطات أو إدارة السواحل.",
    location: "لشبونة، البرتغال",
  },
  "northern-lights": {
    title: "منحة الشفق القطبي البحثية",
    provider: "مجلس أورورا للبحث العلمي",
    description: "وظيفة دكتوراه ممولة لأربع سنوات مع راتب شهري وميزانية للبحث.",
    location: "ستوكهولم، السويد",
  },
  "open-classroom": {
    title: "منحة الفصل المفتوح",
    provider: "صندوق التعلّم العالمي",
    description: "رسوم مخفّضة لبكالوريوس معتمد عبر الإنترنت تدرسه من منزلك.",
    location: "عن بُعد",
  },
  "maple-leaf": {
    title: "منحة ورقة القيقب للدراسات العليا",
    provider: "جامعة نورثفيلد",
    description: "رسوم دراسية كاملة وبدل معيشة للطلاب الدوليين في الصحة العامة.",
    location: "تورنتو، كندا",
  },
  "rising-engineers": {
    title: "منحة المهندسين الصاعدين",
    provider: "معهد كانتو للتكنولوجيا",
    description: "رسوم أربع سنوات دراسية وراتب شهري وسنة من دروس اللغة اليابانية.",
    location: "طوكيو، اليابان",
  },
  "desert-bloom": {
    title: "منحة زهرة الصحراء",
    provider: "مؤسسة الواحة",
    description: "دراسة ممولة بالكامل في الطاقة المتجددة، مع تدريب صيفي في مختبر شريك.",
    location: "أبوظبي، الإمارات العربية المتحدة",
  },
  "alpine-innovation": {
    title: "منحة الابتكار الألبي",
    provider: "مؤسسة هلفيتيا للعلوم",
    description: "راتب سنوي يساعد في تكاليف المعيشة لطلاب الدكتوراه في العلوم التطبيقية.",
    location: "زيورخ، سويسرا",
  },
  "thames-leaders": {
    title: "منحة قادة التايمز",
    provider: "معهد لندن المدني",
    description: "رسوم دراسية وتذاكر طيران وراتب لماجستير مدته سنة في السياسات العامة.",
    location: "لندن، المملكة المتحدة",
  },
};

/** An example scholarship with its text in `locale`; English when there's no translation. */
export function localizedScholarship(scholarship: PublicScholarship, locale: string): PublicScholarship {
  const copy = locale === "ar" ? ARABIC_COPY[scholarship.id] : undefined;
  return copy ? { ...scholarship, ...copy } : scholarship;
}
