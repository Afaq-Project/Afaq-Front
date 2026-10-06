import type { ReactNode } from "react";

interface ProfileSectionProps {
  icon: string;
  title: string;
  onEdit?: () => void;
  onAdd?: () => void;
  children: ReactNode;
}

/** A profile card with an icon title and optional edit / add actions. */
export function ProfileSection({ icon, title, onEdit, onAdd, children }: ProfileSectionProps) {
  return (
    <section className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && <SectionAction icon="edit" label={`Edit ${title}`} onClick={onEdit} />}
          {onAdd && <SectionAction icon="add" label={`Add to ${title}`} onClick={onAdd} />}
        </div>
      </div>
      {children}
    </section>
  );
}

function SectionAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary cursor-pointer"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}
