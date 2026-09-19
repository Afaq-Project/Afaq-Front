import { LifeBuoy, Mail } from "lucide-react";

export function NeedHelpCard() {
  return (
    <div className="relative flex flex-col gap-5 bg-primary-900 shadow-card p-6 rounded-lg h-full overflow-hidden text-white">
      <LifeBuoy
        className="-right-6 -bottom-6 absolute w-36 h-36 text-white/10"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <div className="z-10 relative flex flex-col gap-2">
        <h3 className="font-semibold text-h3">Need help?</h3>
        <p className="text-neutral-100 text-small">
          Our security team is available 24/7 for account-related concerns.
        </p>
      </div>

      <a
        href="mailto:support@levora.app"
        className="z-10 relative inline-flex items-center gap-2 bg-white hover:bg-primary-50 mt-auto px-4 rounded-sm w-fit h-10 font-medium text-primary-800 text-small transition-colors"
      >
        <Mail size={16} strokeWidth={1.75} />
        Contact Support
      </a>
    </div>
  );
}
