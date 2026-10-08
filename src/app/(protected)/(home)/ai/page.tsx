import { Suspense } from "react";
import { AiAssistantView } from "@/src/feature/ai/components/AiAssistantView";

export default function AiAssistantPage() {
  // The view reads ?opportunity= / ?application= / ?q= (useSearchParams), which needs a Suspense boundary.
  return (
    <Suspense>
      <AiAssistantView />
    </Suspense>
  );
}
