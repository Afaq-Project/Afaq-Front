"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

// 40×30, 6px radius. The 1px border keeps mostly-white flags (Qatar, Lebanon, Japan) distinct.
const TILE_CLASS = "flex justify-center items-center border border-neutral-100 rounded-[6px] w-10 h-7.5 overflow-hidden shrink-0";

/**
 * The opportunity's country flag. Remote or country-less opportunities get a globe; a flag that
 * fails to load falls back to the uppercase country code. Decorative: the country name is
 * written next to it.
 */
export function FlagTile({ countryCode, countryName, remote }: { countryCode?: string; countryName?: string; remote: boolean }) {
  const [failed, setFailed] = useState(false);

  if (remote || !countryCode) {
    return (
      <span aria-hidden="true" className={cn(TILE_CLASS, "bg-primary-50 text-primary-800")}>
        <Globe size={16} strokeWidth={1.75} />
      </span>
    );
  }

  if (failed) {
    return (
      <span aria-hidden="true" title={countryName} className={cn(TILE_CLASS, "bg-neutral-50 font-medium text-caption text-neutral-600")}>
        {countryCode.toUpperCase()}
      </span>
    );
  }

  return (
    <span className={TILE_CLASS}>
      {/* A tiny static flag gains nothing from next/image optimization, so a plain img is used. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w80/${countryCode}.png`}
        alt=""
        title={countryName}
        width={40}
        height={30}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </span>
  );
}
