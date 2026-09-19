import { ChevronRight, CreditCard } from "lucide-react";
import Link from "next/link";

export function BillingLinkCard() {
  return (
    <Link
      href="/billing"
      className="group flex items-center gap-4 bg-white hover:shadow-card p-5 border border-neutral-100 hover:border-primary-100 rounded-lg transition-all hover:-translate-y-0.5 duration-200 ease-out"
    >
      <span className="flex justify-center items-center bg-primary-50 rounded-md w-9 h-9 text-primary-700 shrink-0">
        <CreditCard size={18} strokeWidth={1.75} />
      </span>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-neutral-900 text-body">
          Subscription & Billing
        </h2>
        <p className="text-neutral-500 text-caption">
          View your plan, usage, and payment methods.
        </p>
      </div>

      <span className="flex items-center gap-1 font-medium text-primary-600 group-hover:text-primary-800 text-caption transition-colors shrink-0">
        Manage Billing
        <ChevronRight size={16} strokeWidth={1.75} />
      </span>
    </Link>
  );
}
