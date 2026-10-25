"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, CheckCheck, Settings } from "lucide-react";
import { notify } from "@/src/shared/lib/notify";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import { CountTabs } from "@/src/shared/ui/CountTabs";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { useDescribedNotifications, type DescribedNotification } from "../hooks/useDescribedNotifications";
import { dismiss, markAllRead, setRead } from "../services/notificationsStore";
import { groupByTime } from "../services/utils";
import { NotificationRow } from "./NotificationRow";

const PAGE_SIZE = 30;
const FADE_MS = 150;
const PANEL_ID = "notifications-panel";
const SETTINGS_HREF = "/settings#notifications";

type Tab = "all" | "unread";

const subscribeNoop = () => () => {};
/** False during server rendering and hydration: times and day groups depend on the viewer's clock. */
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

function ListSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <Skeleton className="w-16 h-4" />
      <div className="bg-white border border-neutral-100 rounded-lg">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-4 px-4 py-4 border-neutral-100 border-t first:border-t-0">
            <Skeleton className="rounded-md size-8" />
            <div className="flex flex-col flex-1 gap-2">
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
            <Skeleton className="hidden md:block w-28 h-8" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Notifications: All / Unread tabs (in the URL as ?tab=unread), then the list grouped by day
 * (Today, Yesterday, Earlier this week, Earlier), one card per group.
 */
export function NotificationsView() {
  const items = useDescribedNotifications();
  const mounted = useMounted();
  const [now] = useState(() => new Date());
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const tab: Tab = useSearchParams().get("tab") === "unread" ? "unread" : "all";

  const unreadCount = items.filter(({ notification }) => !notification.read).length;
  const visible = tab === "unread" ? items.filter(({ notification }) => !notification.read) : items;
  const shown = visible.slice(0, limit);
  const groups = groupByTime(shown, now);

  const setTab = (next: Tab) => {
    setLimit(PAGE_SIZE);
    router.replace(next === "unread" ? `${pathname}?tab=unread` : pathname, { scroll: false });
  };

  const open = ({ notification, view }: DescribedNotification) => {
    setRead(notification.id, true);
    router.push(view.action.href);
  };

  const handleDismiss = (id: string) => {
    const ids = shown.map(({ notification }) => notification.id);
    const index = ids.indexOf(id);
    const nextId = ids[index + 1] ?? ids[index - 1];
    setLeaving((prev) => new Set(prev).add(id));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.setTimeout(() => {
      const undo = dismiss(id);
      setLeaving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // Focus moves to the neighbouring row's action, or the page heading when the list empties.
      requestAnimationFrame(() => {
        const target = nextId && document.querySelector<HTMLElement>(`[data-notification-id="${CSS.escape(nextId)}"] a`);
        (target || headingRef.current)?.focus();
      });
      notify.withAction("Notification dismissed", { label: "Undo", onClick: undo });
    }, reduced ? 0 : FADE_MS);
  };

  let list: ReactNode;
  if (!mounted) {
    list = <ListSkeleton />;
  } else if (visible.length === 0) {
    list =
      tab === "unread" ? (
        <EmptyState variant="page" icon={Bell} title="No unread notifications" />
      ) : (
        <EmptyState
          variant="page"
          icon={Bell}
          title="You're all caught up"
          message="We'll let you know before deadlines and when reviews are ready."
          action={
            <Link href={SETTINGS_HREF} className={buttonClasses("ghost")}>
              Notification settings
            </Link>
          }
        />
      );
  } else {
    list = (
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.label} aria-label={group.label} className="flex flex-col gap-2">
            <h2 className="font-medium text-caption text-neutral-600">{group.label}</h2>
            <ul className="bg-white border border-neutral-100 rounded-lg">
              {group.items.map((item) => (
                <NotificationRow
                  key={item.notification.id}
                  notification={item.notification}
                  view={item.view}
                  now={now}
                  leaving={leaving.has(item.notification.id)}
                  onOpen={() => open(item)}
                  onRead={() => setRead(item.notification.id, true)}
                  onToggleRead={() => setRead(item.notification.id, !item.notification.read)}
                  onDismiss={() => handleDismiss(item.notification.id)}
                />
              ))}
            </ul>
          </section>
        ))}
        {visible.length > limit && (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={() => setLimit((prev) => prev + PAGE_SIZE)}>
              Show older notifications
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-3">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="focus:outline-none text-h1 text-neutral-900">
            Notifications
          </h1>
          <p className="mt-1 text-body text-neutral-600">Deadlines, reviews, and updates on your applications.</p>
        </div>
        <div className="flex items-center gap-1 -ms-4 sm:ms-0 shrink-0">
          <Button variant="ghost" onClick={markAllRead} disabled={!mounted || unreadCount === 0}>
            <CheckCheck size={16} strokeWidth={1.75} aria-hidden="true" />
            Mark all as read
          </Button>
          <Link href={SETTINGS_HREF} aria-label="Notification settings" className={buttonClasses("ghost", "px-0 w-11 md:w-10")}>
            <Settings size={18} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="border-neutral-100 border-b">
          <CountTabs
            label="Notifications"
            panelId={PANEL_ID}
            active={tab}
            onChange={setTab}
            tabs={[
              { value: "all", label: "All", count: items.length },
              { value: "unread", label: "Unread", count: unreadCount },
            ]}
          />
        </div>
        <div id={PANEL_ID} role="tabpanel" aria-label={tab === "unread" ? "Unread notifications" : "All notifications"}>
          {list}
        </div>
      </div>
    </div>
  );
}
