const ROW_CLASS =
  "flex items-center gap-2.5 px-1 rounded-sm min-h-11 md:min-h-9 text-neutral-800 text-small cursor-pointer hover:bg-neutral-50";
const INPUT_CLASS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 accent-primary-600 size-4 shrink-0";

/** Multi-select list of checkboxes (location, field of study). */
export function CheckboxList({
  legend,
  options,
  selected,
  onChange,
}: {
  legend: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((s) => s !== option) : [...selected, option]);

  return (
    <fieldset>
      <legend className="mb-1 font-medium text-caption text-neutral-600">{legend}</legend>
      {options.map((option) => (
        <label key={option} className={ROW_CLASS}>
          <input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} className={INPUT_CLASS} />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

/** Single-choice list of radios (deadline). */
export function RadioList<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 font-medium text-caption text-neutral-600">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={ROW_CLASS}>
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={INPUT_CLASS}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
