/** PDF or image icon for a file's MIME type. */
export function FileTypeIcon({ mimeType, className = "" }: { mimeType: string; className?: string }) {
  const isPdf = mimeType.includes("pdf");
  return (
    <span
      className={`material-symbols-outlined text-2xl ${isPdf ? "text-error" : "text-info"} ${className}`}
      style={{ fontVariationSettings: "'FILL' 1" }}
      aria-hidden="true"
    >
      {isPdf ? "picture_as_pdf" : "image"}
    </span>
  );
}
