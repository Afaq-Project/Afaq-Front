"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import Button from "@/shared/ui/Button";
import { cn } from "../services/utils";

export function AiAssistantCard() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="hidden relative xl:flex flex-col self-start gap-6 bg-primary-600 shadow-card p-6 rounded-lg w-full h-full min-h-[220px] overflow-hidden text-white">
      {/* bg-primary-600 above is the backup shown until the photo finishes loading */}
      <Image
        src="https://images.unsplash.com/photo-1677442135136-760c813028c0?w=800&q=80&auto=format&fit=crop"
        alt=""
        fill
        sizes="300px"
        onLoad={() => setImageLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-700",
          imageLoaded ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="absolute inset-0 bg-primary-900/70" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex justify-center items-center bg-white/15 rounded-full w-10 h-10">
            <Sparkles size={20} strokeWidth={1.75} />
          </span>
          <h3 className="text-h3">AI assistant</h3>
        </div>

        <p className="mt-1 text-primary-50 text-small">
          Ask eligibility questions, get application guidance, and review your
          essays with AI.
        </p>
      </div>
      <Button
        variant="secondary"
        className="relative gap-2 bg-white hover:bg-primary-50 mt-auto border-transparent w-fit text-primary-800"
      >
        Start a chat
        <ArrowRight size={16} strokeWidth={1.75} />
      </Button>
    </div>
  );
}
