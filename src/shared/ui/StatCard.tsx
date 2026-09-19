import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatTone = "primary" | "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<StatTone, string> = {
  primary: "bg-primary-50 text-primary-600",
  info: "bg-info-50 text-info-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

export default function StatCard({
  icon: Icon,
  tone = "primary",
  label,
  value,
  caption,
  href,
}: {
  icon: LucideIcon;
  tone?: StatTone;
  label: string;
  value: string;
  caption?: string;
  href?: string;
}) {
  const body = (
    <div
      className={`flex items-start gap-3.5 bg-white shadow-card p-5 rounded-lg h-full ${
        href ? "hover:-translate-y-0.5 transition-transform duration-200" : ""
      }`}
    >
      <div
        className={`flex justify-center items-center rounded-md w-11 h-11 shrink-0 ${TONE_CLASSES[tone]}`}
      >
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-neutral-500 text-caption">{label}</p>
        <p className="mt-0.5 font-bold text-neutral-900 text-2xl truncate">{value}</p>
        {caption && <p className="mt-1 text-neutral-400 text-caption truncate">{caption}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    );
  }

  return body;
}
