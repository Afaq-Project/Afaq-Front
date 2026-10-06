interface SkillChipProps {
  name: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

/** A toggleable skill pill. */
export function SkillChip({ name, selected, disabled, onToggle }: SkillChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
        selected
          ? "bg-primary text-on-primary shadow-sm-subtle cursor-pointer"
          : disabled
          ? "border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed"
          : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-high cursor-pointer"
      }`}
    >
      {selected && <span className="material-symbols-outlined text-[16px]">check</span>}
      <span>{name}</span>
    </button>
  );
}
