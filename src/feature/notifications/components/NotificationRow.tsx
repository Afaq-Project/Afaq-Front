"use client";

import { useId, useState, type MouseEvent } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Popover } from "@/src/shared/ui/Popover";
import { relativeTime, type NotificationView } from "../services/utils";
import type { Notification } from "../types/notification";

const ICON_BUTTON =
  "flex justify-center items-center hover:bg-neutral-100 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-8 text-neutral-600 hover:text-neutral-900 transition-colors";
const MENU_ITEM =
  "flex items-center px-3 rounded-sm w-full min-h-11 md:min-h-9 text-small text-start text-neutral-800 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

// On devices that can hover, the ⋯ button sits over the time and shows on hover or focus; on
// touch screens both are always visible, side by side.
const HOVER = "[@media(hover:hover)]";
const TIME_HIDES = `${HOVER}:group-hover:opacity-0 ${HOVER}:group-focus-within:opacity-0`;
const MENU_SHOWS = `${HOVER}:absolute ${HOVER}:inset-y-0 ${HOVER}:end-0 ${HOVER}:flex ${HOVER}:items-center ${HOVER}:opacity-0 ${HOVER}:group-hover:opacity-100 ${HOVER}:group-focus-within:opacity-100`;

function IconTile({ view }: { view: NotificationView }) {
  const Icon = view.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex justify-center items-center rounded-md size-8 shrink-0",
        view.urgent ? "bg-danger-50 text-danger-800" : "bg-neutral-50 text-neutral-600",
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

/** Title (with the opportunity's flag) and body. The unread state is in the accessible name too. */
function Content({ notification, view, titleId, compact }: { notification: Notification; view: NotificationView; titleId?: string; compact: boolean }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p id={titleId} className={cn("text-body text-neutral-900", notification.read ? "font-normal" : "font-semibold", compact && "truncate")}>
        {!notification.read && <span className="sr-only">Unread: </span>}
        {view.flag && <FlagTile size="sm" {...view.flag} className="inline-flex me-1.5 align-[-3px]" />}
        {view.title}
      </p>
      <p className={cn("text-neutral-600 text-small", compact ? "truncate" : "line-clamp-2 lg:line-clamp-1")}>{view.body}</p>
    </div>
  );
}

function Time({ notification, now, className }: { notification: Notification; now: Date; className?: string }) {
  return (
    <span className={cn("flex justify-end items-center gap-1.5 text-caption text-neutral-600 whitespace-nowrap transition-opacity", className)}>
      {!notification.read && <span aria-hidden="true" className="bg-primary-600 rounded-full size-2 shrink-0" />}
      <time dateTime={notification.createdAt}>{relativeTime(notification.createdAt, now)}</time>
    </span>
  );
}

function RowMenu({
  notification,
  title,
  onToggleRead,
  onDismiss,
}: {
  notification: Notification;
  title: string;
  onToggleRead: () => void;
  onDismiss: () => void;
}) {
  const [open, setOpen] = useState(false);
  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div className="relative z-10 has-aria-expanded:z-30">
      <Popover
        open={open}
        onOpenChange={setOpen}
        label={`More actions for ${title}`}
        panelClassName="w-48 p-1"
        trigger={(triggerProps) => (
          <button type="button" {...triggerProps} aria-label={`More actions for ${title}`} className={ICON_BUTTON}>
            <MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      >
        <ul className="flex flex-col">
          <li>
            <button type="button" onClick={() => run(onToggleRead)} className={MENU_ITEM}>
              {notification.read ? "Mark as unread" : "Mark as read"}
            </button>
          </li>
          <li>
            <button type="button" onClick={() => run(onDismiss)} className={MENU_ITEM}>
              Dismiss
            </button>
          </li>
        </ul>
      </Popover>
    </div>
  );
}

const isInteractive = (event: MouseEvent) => (event.target as HTMLElement).closest("a, button, [role='dialog']") !== null;

/**
 * One notification. From 768px a grid row: icon (32px), title and body, the typed action, then
 * the time (96px) with the ⋯ menu. Below 768px: icon, content and time on top, the action full
 * width below. Clicking the row outside its controls marks it read and follows the action.
 */
export function NotificationRow({
  notification,
  view,
  now,
  leaving = false,
  onOpen,
  onRead,
  onToggleRead,
  onDismiss,
}: {
  notification: Notification;
  view: NotificationView;
  now: Date;
  /** Fading out before removal. */
  leaving?: boolean;
  /** The action link was followed: mark it read (the link does the navigating). */
  onRead: () => void;
  /** Marks it read and goes to the action's page. */
  onOpen: () => void;
  onToggleRead: () => void;
  onDismiss: () => void;
}) {
  const titleId = useId();

  return (
    <li
      data-notification-id={notification.id}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (!isInteractive(event)) onOpen();
      }}
      className={cn(
        "group relative items-start md:items-center gap-x-4 gap-y-3 grid grid-cols-[32px_minmax(0,1fr)_auto] md:grid-cols-[32px_minmax(0,1fr)_auto_96px] px-4 py-4",
        "border-neutral-100 border-t first:border-t-0 first:rounded-t-lg last:rounded-b-lg hover:bg-neutral-50 cursor-pointer",
        "transition-opacity duration-150 motion-reduce:transition-none",
        leaving && "opacity-0",
      )}
    >
      <IconTile view={view} />
      <Content notification={notification} view={view} titleId={titleId} compact={false} />

      <div className="col-span-full md:col-span-1 md:col-start-3 row-start-2 md:row-start-1">
        <Link
          href={view.action.href}
          onClick={onRead}
          aria-describedby={titleId}
          className={buttonClasses("soft", "w-full md:w-auto md:h-8 px-3 text-small whitespace-nowrap")}
        >
          {view.action.label}
        </Link>
      </div>

      <div className="relative flex justify-end items-center gap-1 col-start-3 md:col-start-4 row-start-1 min-h-8">
        <Time notification={notification} now={now} className={TIME_HIDES} />
        <div className={MENU_SHOWS}>
          <RowMenu notification={notification} title={view.title} onToggleRead={onToggleRead} onDismiss={onDismiss} />
        </div>
      </div>
    </li>
  );
}

/** The bell dropdown's row: no action button or menu, a one-line body, the whole row a link. */
export function CompactNotificationRow({
  notification,
  view,
  now,
  onOpen,
}: {
  notification: Notification;
  view: NotificationView;
  now: Date;
  onOpen: () => void;
}) {
  return (
    <li className="border-neutral-100 border-t first:border-t-0">
      <Link
        href={view.action.href}
        onClick={onOpen}
        className="items-start gap-x-3 grid grid-cols-[32px_minmax(0,1fr)_auto] hover:bg-neutral-50 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset transition-colors"
      >
        <IconTile view={view} />
        <Content notification={notification} view={view} compact />
        <Time notification={notification} now={now} className="pt-0.5" />
      </Link>
    </li>
  );
}
