"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY } from "@/src/feature/profile/hooks/useProfileQuery";
import { profileService } from "@/src/feature/profile/services/profileService";
import { ProfileStatusCard } from "./ProfileStatusCard";

/** The screen after onboarding, with the user's current profile completion. */
export function CompletionStep() {
  const router = useRouter();
  // Always refetch on arrival: a cached percentage from before onboarding finished would be stale.
  const { data: profile, isFetchedAfterMount } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.getProfile,
    refetchOnMount: "always",
  });

  return (
    <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-12">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        <Image
          src="/onboarding/complete.svg"
          alt=""
          width={200}
          height={200}
          className="object-contain"
          aria-hidden="true"
          priority
        />

        <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-surface tracking-tight">
          You&apos;re all set!
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-sm leading-relaxed">
          Your account has been created successfully. Finish the rest of your profile later to get even better
          scholarship and internship matches.
        </p>

        <ProfileStatusCard
          completionPercentage={profile?.completionPct ?? 0}
          isLoading={!isFetchedAfterMount}
        />

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="bg-primary hover:opacity-90 text-on-primary font-semibold text-base md:text-lg rounded-xl px-6 py-3.5 flex items-center justify-center w-full transition-all space-x-2 shadow-sm cursor-pointer active:scale-[0.99]"
        >
          <span>Go to my dashboard</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        <Link href="/profile" className="inline-block text-xs md:text-sm font-medium text-primary hover:underline pt-1">
          Or review full profile settings
        </Link>
      </div>
    </main>
  );
}
