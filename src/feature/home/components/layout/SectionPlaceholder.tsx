import { content } from "../../content/en";

/** Stand-in for a section that hasn't been built yet: its name, its anchor and a short note. */
export function SectionPlaceholder({ name, anchor }: { name: string; anchor: string }) {
  const { placeholder } = content;

  return (
    <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-2 p-6 border border-neutral-200 border-dashed rounded-lg min-h-40">
      <div className="flex flex-col gap-1 text-start">
        <p className="text-landing-h3 text-neutral-900">{name}</p>
        <p className="text-landing-small text-neutral-600">{placeholder.note}</p>
      </div>
      <code dir="ltr" className="bg-white px-2.5 py-1 border border-neutral-100 rounded-full text-landing-caption text-neutral-600">
        #{anchor}
      </code>
    </div>
  );
}
