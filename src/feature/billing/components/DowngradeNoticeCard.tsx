import { Info } from "lucide-react";

export function DowngradeNoticeCard() {
  return (
    <div className="bg-danger-50 p-4 border-2 border-danger-100 rounded-lg">
      <div className="flex items-start gap-2">
        <Info
          size={16}
          strokeWidth={1.75}
          className="mt-0.5 text-danger-600 shrink-0"
        />
        <div>
          <p className="font-semibold text-danger-800 text-small">
            Downgrade Notice
          </p>
          <p className="mt-1 text-caption text-danger-700 leading-relaxed">
            Switching to the Free plan will result in the loss of{" "}
            <span className="font-medium">
              unlimited history tracking and priority support
            </span>
            . Active document reviews will be limited to 3 per month.
          </p>
        </div>
      </div>
    </div>
  );
}
