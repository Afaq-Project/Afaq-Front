import { Suspense } from "react";
import { NotificationsView } from "@/src/feature/notifications/components/NotificationsView";

export default function NotificationsPage() {
  // The view reads its tab from the URL (useSearchParams), which needs a Suspense boundary.
  return (
    <Suspense>
      <NotificationsView />
    </Suspense>
  );
}
