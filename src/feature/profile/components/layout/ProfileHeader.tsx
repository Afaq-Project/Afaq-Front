import Badge from "@/src/shared/ui/Badge";

interface ProfileHeaderProps {
  name: string;
  email: string;
  photoUrl?: string | null;
  completionPct: number;
  isMatchable?: boolean;
}

/** Name, photo, matching status and profile completion. */
export function ProfileHeader({ name, email, photoUrl, completionPct, isMatchable }: ProfileHeaderProps) {
  return (
    <div className="bg-neutral-50 rounded-xl border border-neutral-100 shadow-sm px-6 py-5 flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-3xl text-neutral-500">person</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-neutral-900 truncate">{name}</h1>
        <p className="text-sm text-neutral-500 truncate">{email}</p>
        {isMatchable !== undefined && (
          <Badge tone={isMatchable ? "teal" : "amber"} className="mt-2">
            {isMatchable ? "Eligible for matching" : "Not yet eligible for matching"}
          </Badge>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-sm font-semibold text-primary">{completionPct}% Complete</span>
        <div className="w-28 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
