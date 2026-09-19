"use client";

import { ArrowRight, ArrowUpRight, Bot, Sparkles } from "lucide-react";

import Button from "@/src/shared/ui/Button";

export function AiAssistantCard() {
  return (
    <div
      className="hidden relative xl:flex flex-col self-start gap-6 bg-primary-400 shadow-card p-6 rounded-lg w-full h-full min-h-[220px] overflow-hidden text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 0% 0%, #97c459 0%, transparent 55%), radial-gradient(circle at 100% 100%, #fff 0%, transparent 55%)",
      }}
    >
      <ArrowUpRight
        className="top-5 right-5 absolute w-5 h-5 text-white/60"
        strokeWidth={2}
        aria-hidden="true"
      />
      <Bot
        className="-right-0 -bottom-8 absolute w-28 h-28 text-primary-600"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex justify-center items-center bg-white/15 rounded-full w-10 h-10">
            <Sparkles size={20} strokeWidth={1.75} />
          </span>
          <h3 className="font-semibold text-primary-50 text-small">
            AI assistant
          </h3>
        </div>

        <p className="text-h3">
          Ask eligibility questions, get application guidance, and{" "}
          <span className="font-bold">review your essays</span> with AI.
        </p>
      </div>
      <Button
        variant="secondary"
        className="gap-2 bg-white hover:bg-primary-50 mt-auto border-transparent w-fit text-primary-800"
      >
        Start a chat
        <ArrowRight size={16} strokeWidth={1.75} />
      </Button>
    </div>
  );
}
