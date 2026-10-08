"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CompletionDonut } from "@/src/shared/ui/CompletionDonut";
import { cn } from "../services/utils";
import { CARD_CLASS } from "./styles";

const AUTO_DISMISS_MS = 2500;
const FADE_MS = 250;
// The donut's arc takes 400ms; the check fades in after it (600ms total).
const CHECK_AFTER_MS = 400;

// TODO: move this flag server-side (a per-user setting) once the API has somewhere to keep it.
const seenKey = (userId: string) => `afaq:profile-complete-seen:${userId}`;

function hasSeen(userId: string) {
  try {
    return window.localStorage.getItem(seenKey(userId)) === "1";
  } catch {
    // Storage blocked (private mode, site data off): treat as seen so it can't repeat every visit.
    return true;
  }
}

function markSeen(userId: string) {
  try {
    window.localStorage.setItem(seenKey(userId), "1");
  } catch {
    // Nothing to do; hasSeen() already treats unreadable storage as seen.
  }
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Shown once per user, the first time the dashboard loads with the profile at 100%: the donut
 * fills, a check replaces the number, then the card fades away after 2.5s or on click. With
 * reduced motion it's static and stays for that visit. Renders nothing after the first time.
 */
export function ProfileCompleteMoment({ userId }: { userId: string }) {
  // Signed-in pages render on the client only, so storage and media queries are safe here.
  const [show] = useState(() => !hasSeen(userId));
  const [reduced] = useState(prefersReducedMotion);
  const [filled, setFilled] = useState(reduced);
  const [checked, setChecked] = useState(reduced);
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    if (!show) return;
    markSeen(userId);
    if (reduced) return;

    const timers = [
      // Start from an empty ring on the next frame so the fill transition runs.
      window.setTimeout(() => setFilled(true), 16),
      window.setTimeout(() => setChecked(true), CHECK_AFTER_MS),
      window.setTimeout(() => setPhase("leaving"), AUTO_DISMISS_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [show, reduced, userId]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("gone"), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!show || phase === "gone") return null;

  return (
    <section
      role="status"
      aria-label="Profile complete"
      onClick={reduced ? undefined : () => setPhase("leaving")}
      className={cn(
        CARD_CLASS,
        "flex items-center gap-4 self-start w-full transition-opacity duration-250 motion-reduce:transition-none",
        phase === "leaving" && "opacity-0",
      )}
    >
      <CompletionDonut
        // 1, not 0: the donut only draws its arc above 0, and the arc must exist for the fill to animate.
        percent={filled ? 100 : 1}
        size={56}
        center={
          checked ? (
            <Check
              size={22}
              strokeWidth={2.5}
              aria-hidden="true"
              className="text-primary-600 transition-opacity duration-200 starting:opacity-0 motion-reduce:transition-none"
            />
          ) : undefined
        }
      />
      <p className="text-body text-neutral-800">
        Your profile is complete. Your matches are now as accurate as they can be.
      </p>
    </section>
  );
}
