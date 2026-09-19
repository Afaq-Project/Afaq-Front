"use client";

import { ChevronRight, Eye, Trash2 } from "lucide-react";

export function DataPrivacyCard() {
  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg h-full">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="flex justify-center items-center bg-primary-50 rounded-md w-9 h-9 text-primary-700">
          <Eye size={18} strokeWidth={1.75} />
        </span>
        <h2 className="font-semibold text-body text-neutral-900">
          Data & Privacy
        </h2>
      </div>
      <p className="mb-3 text-caption text-neutral-500">
        Control how your information is handled and managed within our
        ecosystem.
      </p>

      <div className="flex flex-col border-neutral-100 border-t divide-y divide-neutral-100">
        <button
          type="button"
          className="flex justify-between items-center gap-3 hover:bg-neutral-50 py-3 text-left transition-colors"
        >
          <div>
            <p className="font-medium text-neutral-900 text-small">
              Request Data Export
            </p>
            <p className="text-caption text-neutral-500">
              Receive a copy of your personal records via email.
            </p>
          </div>
          <ChevronRight
            size={16}
            strokeWidth={1.75}
            className="text-neutral-400 shrink-0"
          />
        </button>

        <button
          type="button"
          className="flex justify-between items-center gap-3 hover:bg-danger-50 py-3 text-left transition-colors"
        >
          <div>
            <p className="font-medium text-danger-700 text-small">
              Request Account Deletion
            </p>
            <p className="text-caption text-neutral-500">
              Permanently remove all your data from Afaq.
            </p>
          </div>
          <span className="flex justify-center items-center w-8 h-8 text-danger-600 shrink-0">
            <Trash2 size={16} strokeWidth={1.75} />
          </span>
        </button>
      </div>
    </div>
  );
}
