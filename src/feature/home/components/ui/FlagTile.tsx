"use client";

import Image from "next/image";
import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { useLandingContent } from "../../content";

const SIZES = {
  sm: { tile: "w-6 h-4.5", width: 24, height: 18, icon: 12 },
  md: { tile: "w-10 h-7.5", width: 40, height: 30, icon: 16 },
};

interface FlagTileProps {
  /** ISO 3166-1 alpha-2 code ("jo"), or "remote" for the globe tile. */
  code: string;
  /** sm: 24×18. md: 40×30. */
  size?: keyof typeof SIZES;
  /** Country name for screen readers. Leave out when the name is written next to the flag. */
  label?: string;
  className?: string;
}

/**
 * 4:3 country flag with a 1px border (keeps mostly-white flags visible). Remote, or a flag that
 * fails to load, shows a globe. Flags are never mirrored, even right to left.
 */
export function FlagTile({ code, size = "md", label, className }: FlagTileProps) {
  const content = useLandingContent();
  const [failed, setFailed] = useState(false);
  const dims = SIZES[size];
  const remote = code === "remote";
  const tileClass = cn("inline-flex justify-center items-center shrink-0 border border-neutral-100 rounded-[4px] overflow-hidden", dims.tile, className);

  if (remote || failed) {
    const name = remote ? content.common.remote : label;
    return (
      <span role={name ? "img" : undefined} aria-label={name} aria-hidden={name ? undefined : true} className={cn(tileClass, "bg-primary-50 text-primary-800")}>
        <Globe size={dims.icon} strokeWidth={1.75} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={tileClass}>
      <Image
        src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
        alt={label ?? ""}
        width={dims.width}
        height={dims.height}
        sizes={`${dims.width}px`}
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </span>
  );
}
