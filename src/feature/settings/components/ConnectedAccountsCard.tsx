"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { GoogleIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";

export function ConnectedAccountsCard() {
  const [googleConnected, setGoogleConnected] = useState(true);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex justify-center items-center bg-primary-50 rounded-md w-9 h-9 text-primary-700">
          <Link2 size={18} strokeWidth={1.75} />
        </span>
        <h2 className="font-semibold text-body text-neutral-900">
          Connected Accounts
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-md">
          <span className="flex justify-center items-center bg-white shadow-sm rounded-full w-9 h-9 shrink-0">
            <GoogleIcon className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-neutral-900 text-small">Google</p>
            <p className="text-caption text-neutral-500 truncate">
              {googleConnected
                ? "Connected as hello@afaq.app"
                : "Connect your Google account"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGoogleConnected((prev) => !prev)}
            className={cn(
              "font-medium text-caption transition-colors shrink-0",
              googleConnected
                ? "text-danger-600 hover:text-danger-800"
                : "text-primary-600 hover:text-primary-800",
            )}
          >
            {googleConnected ? "Disconnect" : "Connect"}
          </button>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-md">
          <span className="flex justify-center items-center bg-white shadow-sm rounded-full w-9 h-9 shrink-0">
            <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-neutral-900 text-small">LinkedIn</p>
            <p className="text-caption text-neutral-500 truncate">
              {linkedinConnected
                ? "Connected as hello@afaq.app"
                : "Connect your professional profile"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLinkedinConnected((prev) => !prev)}
            className={cn(
              "font-medium text-caption transition-colors shrink-0",
              linkedinConnected
                ? "text-danger-600 hover:text-danger-800"
                : "text-primary-600 hover:text-primary-800",
            )}
          >
            {linkedinConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
