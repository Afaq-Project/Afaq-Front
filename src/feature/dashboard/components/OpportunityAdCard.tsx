"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../services/utils";

export function OpportunityAdCard() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="hidden relative xl:flex flex-col self-start bg-primary-900 shadow-card rounded-lg w-full h-full min-h-[220px] overflow-hidden text-white">
      <Image
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop"
        alt=""
        fill
        sizes="350px"
        onLoad={() => setImageLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-700",
          imageLoaded ? "opacity-100" : "opacity-0",
        )}
      />
      {/* brand color wash so the photo reads as part of the product, not a stock image */}
      <div className="absolute inset-0 bg-primary-800/50 mix-blend-multiply" />
      <div className="absolute inset-0 bg-linear-to-t from-primary-900/95 via-primary-900/30 to-primary-900/10" />

      <span className="top-5 left-5 z-10 absolute bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold text-[11px] text-primary-800 uppercase tracking-wider">
        Opening soon
      </span>

      <ArrowUpRight
        className="top-5 right-5 z-10 absolute w-5 h-5 text-white/80"
        strokeWidth={2}
        aria-hidden="true"
      />

      <div className="z-10 relative flex flex-col gap-1 mt-auto p-6">
        <h3 className="text-h3">New scholarship opportunity</h3>
        <p className="text-neutral-100 text-small">
          Applications open October 1 — get your documents ready before the
          deadline.
        </p>
      </div>
    </div>
  );
}
