import {
  Atom,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Brush,
  Building2,
  ChartPie,
  Code,
  Cog,
  Compass,
  Cpu,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartPulse,
  Laptop,
  Microscope,
  Palette,
  PenTool,
  Pill,
  Ruler,
  Star,
  Stethoscope,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { OpportunityType } from "../../types/opportunity";

type FieldGroup = "engineering" | "computerScience" | "health" | "business" | "arts" | "science" | "other";

const FIELD_ICONS: Record<FieldGroup, LucideIcon[]> = {
  engineering: [Cog, Wrench, Ruler],
  computerScience: [Code, Cpu, Laptop],
  health: [Stethoscope, HeartPulse, Pill],
  business: [TrendingUp, ChartPie, Building2],
  arts: [Palette, PenTool, Brush],
  science: [Atom, FlaskConical, Microscope],
  // Unknown fields get generic icons alongside the type icons.
  other: [Globe, Compass, Star],
};

const TYPE_ICONS: Record<OpportunityType, LucideIcon[]> = {
  Scholarship: [GraduationCap, BookOpen],
  Internship: [Briefcase, BadgeCheck],
};

// Order matters: "computer science" must be checked before the generic "science".
const FIELD_KEYWORDS: [FieldGroup, string[]][] = [
  ["computerScience", ["computer", "software", "data", "information"]],
  ["engineering", ["engineer"]],
  ["health", ["medic", "health", "nurs", "pharm"]],
  ["business", ["business", "econom", "finance", "management", "marketing"]],
  ["arts", ["art", "design", "music", "media"]],
  ["science", ["science", "physic", "chemi", "biolog", "math"]],
];

function fieldGroup(field: string): FieldGroup {
  const name = field.toLowerCase();
  return FIELD_KEYWORDS.find(([, keywords]) => keywords.some((keyword) => name.includes(keyword)))?.[0] ?? "other";
}

/** Small stable string hash (FNV-1a), so an id always yields the same arrangement. */
function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Hand-tuned slots within the pattern area: position (% of the area), size (px), rotation
// (deg), opacity (0.24–0.40). Seven field slots and three type slots.
const SLOTS: { x: number; y: number; size: number; rotate: number; opacity: number; kind: "field" | "type" }[] = [
  { x: 8, y: 58, size: 18, rotate: -10, opacity: 0.24, kind: "field" },
  { x: 19, y: 18, size: 24, rotate: 8, opacity: 0.28, kind: "type" },
  { x: 31, y: 64, size: 28, rotate: -6, opacity: 0.34, kind: "field" },
  { x: 42, y: 24, size: 16, rotate: 12, opacity: 0.24, kind: "field" },
  { x: 51, y: 72, size: 20, rotate: -12, opacity: 0.3, kind: "type" },
  { x: 61, y: 20, size: 32, rotate: 6, opacity: 0.4, kind: "field" },
  { x: 70, y: 58, size: 22, rotate: -4, opacity: 0.34, kind: "field" },
  { x: 80, y: 24, size: 18, rotate: 15, opacity: 0.28, kind: "type" },
  { x: 87, y: 68, size: 30, rotate: -15, opacity: 0.4, kind: "field" },
  { x: 95, y: 34, size: 16, rotate: 10, opacity: 0.24, kind: "field" },
];

/**
 * Decorative outline icons for the details header band, chosen by field (and type), on the
 * band's right ~55% and faded out toward the left so the title area stays clean. The
 * opportunity id picks which icon goes in each fixed slot.
 */
export function FieldPattern({ id, field, type }: { id: string; field: string; type: OpportunityType }) {
  const fieldIcons = FIELD_ICONS[fieldGroup(field)];
  const typeIcons = TYPE_ICONS[type];
  const seed = hash(id);

  let fieldIndex = 0;
  let typeIndex = 0;

  return (
    <div
      aria-hidden="true"
      className="top-0 right-0 bottom-0 absolute w-[55%] pointer-events-none [mask-image:linear-gradient(to_left,black_55%,transparent)]"
    >
      {SLOTS.map((slot, index) => {
        const pool = slot.kind === "field" ? fieldIcons : typeIcons;
        const step = slot.kind === "field" ? fieldIndex++ : typeIndex++;
        const Icon = pool[(seed + step) % pool.length];
        return (
          <Icon
            key={index}
            size={slot.size}
            strokeWidth={1.75}
            className="absolute text-primary-600"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              opacity: slot.opacity,
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
