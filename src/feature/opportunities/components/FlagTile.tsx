"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

// The 1px border keeps mostly-white flags (Qatar, Lebanon, Japan) distinct.
const TILE_BASE = "flex justify-center items-center border border-neutral-100 overflow-hidden shrink-0";
const SIZES = {
  md: { tile: "rounded-[6px] w-10 h-7.5", width: 40, height: 30, icon: 16 },
  lg: { tile: "rounded-[8px] w-14 h-10.5", width: 56, height: 42, icon: 22 },
};

/**
 * The opportunity's country flag. Remote or country-less opportunities get a globe; a flag that
 * fails to load falls back to the uppercase country code. Decorative: the country name is
 * written next to it.
 */
export function FlagTile({
  countryCode,
  countryName,
  remote,
  size = "md",
  className,
}: {
  countryCode?: string;
  countryName?: string;
  remote: boolean;
  /** md: 40×30 (cards). lg: 56×42 (details header). */
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const dims = SIZES[size];
  const TILE_CLASS = cn(TILE_BASE, dims.tile, className);

  if (remote || !countryCode) {
    return (
      <span aria-hidden="true" className={cn(TILE_CLASS, "bg-primary-50 text-primary-800")}>
        <Globe size={dims.icon} strokeWidth={1.75} />
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
        src={`https://flagcdn.com/${size === "lg" ? "w160" : "w80"}/${countryCode}.png`}
        alt=""
        title={countryName}
        width={dims.width}
        height={dims.height}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </span>
  );
}
