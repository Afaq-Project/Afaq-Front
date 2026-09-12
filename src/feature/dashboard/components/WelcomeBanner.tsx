"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";

export function WelcomeBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [visible, setVisible] = useState(
    () => searchParams.get("welcome") === "1",
  );

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      // Strip the flag from the URL so a refresh doesn't re-trigger the banner.
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className="flex justify-between items-center gap-3 bg-primary-50 px-4 py-3 border border-primary-200 rounded-lg">
      <p className="text-primary-800 text-sm">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""} - your account is
        ready.
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="text-primary-800 hover:text-primary-900"
      >
        <X size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
