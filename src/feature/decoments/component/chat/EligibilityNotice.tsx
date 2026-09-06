import { AlertTriangle } from "lucide-react";
import { EligibilityNotice as EligibilityNoticeType } from "./types";

export default function EligibilityNoticeCard({
    notice,
}: {
    notice: EligibilityNoticeType;
}) {
    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 max-w-[85%]">
            <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-700" />

                <span className="font-medium text-amber-900 text-sm">
                    {notice.title}
                </span>
            </div>

            <p className="text-sm text-amber-900 leading-relaxed">
                {notice.message}
            </p>

            {notice.websiteUrl && (
                <a
                    href={notice.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-md px-3 py-1.5 hover:bg-stone-50 transition-colors"
                >
                    Visit official website
                </a>
            )}
        </div>
    );
}