import { Info } from "lucide-react";

export function StripeMonitoringBanner() {
  return (
    <div className="flex items-start gap-2.5 bg-info-50 px-4 py-3 border border-info-400/40 rounded-lg">
      <Info size={16} strokeWidth={1.75} className="flex-shrink-0 mt-0.5 text-info-800" />
      <p className="text-info-800 text-small">
        Billing is processed via Stripe — this is a monitoring view, not a payment-control panel.
      </p>
    </div>
  );
}
