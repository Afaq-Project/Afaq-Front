export type ProfileTabId = "personal" | "background" | "education";

export const PROFILE_TABS: { id: ProfileTabId; label: string; icon: string }[] = [
  { id: "personal", label: "Personal Details", icon: "person" },
  { id: "background", label: "Background & Goals", icon: "psychology" },
  { id: "education", label: "Education", icon: "school" },
];

interface ProfileTabNavProps {
  active: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
}

/** Vertical tab list on desktop, a horizontal strip on mobile. */
export function ProfileTabNav({ active, onChange }: ProfileTabNavProps) {
  return (
    <>
      <nav className="w-52 shrink-0 flex-col gap-1 hidden md:flex" aria-label="Profile sections">
        {PROFILE_TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                isActive ? "bg-primary text-white" : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex md:hidden gap-2 mb-1 w-full overflow-x-auto" aria-label="Profile sections">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={tab.id === active ? "page" : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab.id === active ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
