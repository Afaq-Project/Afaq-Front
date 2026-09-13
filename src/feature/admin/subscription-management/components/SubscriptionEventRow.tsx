import Badge from "@/src/shared/ui/Badge";
import { SubscriptionEvent } from "../types/event";
import { EVENT_TYPE_TONE } from "../types/status";
import { formatDate } from "../services/utils";

export function SubscriptionEventRow({ event }: { event: SubscriptionEvent }) {
  return (
    <tr className="border-neutral-100 border-t even:bg-neutral-50">
      <td className="px-5 py-4">
        <p className="font-medium text-neutral-900 text-small">{event.userName}</p>
        <p className="text-neutral-500 text-caption">{event.userEmail}</p>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge tone={EVENT_TYPE_TONE[event.eventType]}>{event.eventType}</Badge>
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {formatDate(event.date)}
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {event.billingCycle}
      </td>
    </tr>
  );
}
