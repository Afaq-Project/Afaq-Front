import { AlertTriangle, CheckCircle2, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { ReviewFindingsSection } from "@/feature/documents/components/ReviewFindingsSection";
import { ReviewResult, ReviewUsage } from "@/feature/documents/types/document.types";

interface ReviewSidebarProps {
  usage: ReviewUsage;
  result: ReviewResult;
}

export function ReviewSidebar({ usage, result }: ReviewSidebarProps) {
  const remaining = usage.total - usage.used;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto">
      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
            <MapPin size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-stone-900">AI Review Ready</p>
            <p className="mt-0.5 text-sm text-stone-500">
              Get instant, actionable feedback on your document.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
          <span>
            {usage.used} of {usage.total} free reviews used
          </span>
          <button className="font-medium text-stone-900 hover:underline">
            Upgrade to Premium
          </button>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-stone-900"
            style={{ width: `${(usage.used / usage.total) * 100}%` }}
          />
        </div>

        <Button
          className="mt-4 w-full"
          disabled={remaining <= 0}
        >
          <Sparkles size={16} />
          Request AI Review
        </Button>
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Review Results</h2>
          <span className="flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
            <TrendingUp size={12} />
            Score: {result.score}/100
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <ReviewFindingsSection
            title="Strengths"
            icon={CheckCircle2}
            tone="success"
            findings={result.strengths}
          />
          <ReviewFindingsSection
            title="Suggestions for Improvement"
            icon={Sparkles}
            tone="info"
            findings={result.suggestions}
          />
          <ReviewFindingsSection
            title="Areas of Concern"
            icon={AlertTriangle}
            tone="warning"
            findings={result.concerns}
          />
        </div>
      </div>
    </div>
  );
}
