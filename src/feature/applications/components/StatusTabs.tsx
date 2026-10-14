import { CountTabs } from "@/src/shared/ui/CountTabs";
import { STATUS_TABS, type StatusTab } from "../types/filters";

/** Status tabs that double as the status filter, each with its count. */
export function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: StatusTab;
  counts: Record<StatusTab, number>;
  onChange: (tab: StatusTab) => void;
}) {
  return (
    <CountTabs
      label="Filter by status"
      tabs={STATUS_TABS.map((tab) => ({ value: tab.value, label: tab.label, count: counts[tab.value] }))}
      active={active}
      onChange={onChange}
    />
  );
}
