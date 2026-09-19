import { CreditCard, Plus } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";

export function PaymentMethodCard() {
  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-neutral-900 text-body">
            Payment Method
          </h2>
          <p className="mt-0.5 text-neutral-500 text-caption">
            Cards are securely processed via Stripe. Your data is encrypted.
          </p>

          <div className="flex items-center gap-3 bg-neutral-50 mt-4 p-3 rounded-md">
            <span className="flex justify-center items-center bg-white shadow-sm rounded-md w-10 h-7 shrink-0">
              <CreditCard
                size={16}
                strokeWidth={1.75}
                className="text-neutral-500"
              />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-neutral-900 text-small">
                  Visa ending in 4242
                </p>
                <Badge tone="gray">Primary</Badge>
              </div>
              <p className="text-neutral-500 text-caption">Expires 12/2026</p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 mt-3 font-medium text-primary-600 hover:text-primary-800 text-caption transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Add backup method
          </button>
        </div>

        <div className="flex sm:flex-col flex-row gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex justify-center items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-4 rounded-sm h-10 font-medium text-neutral-700 text-sm transition-colors"
          >
            <CreditCard size={15} strokeWidth={1.75} />
            Update Card
          </button>
          <button
            type="button"
            className="inline-flex justify-center items-center bg-transparent hover:bg-danger-50 px-4 border border-danger-200 rounded-sm h-10 font-medium text-danger-700 text-sm transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
