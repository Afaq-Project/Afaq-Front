"use client";

import { useSyncExternalStore } from "react";
import { NOTIFICATIONS } from "../mocks/notifications";
import type { Notification } from "../types/notification";

/**
 * The user's notifications, shared by the Notifications page and the top-bar bell so read state
 * and dismissals agree.
 *
 * TODO: there's no notifications API yet. State lives in memory and resets on reload; swap these
 * functions for the list, mark-read, mark-all-read and dismiss calls once they exist.
 */
let state: Notification[] = NOTIFICATIONS;
const listeners = new Set<() => void>();

function set(next: Notification[]) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Newest first. */
export function useNotifications() {
  return useSyncExternalStore(subscribe, () => state, () => NOTIFICATIONS);
}

export function setRead(id: string, read: boolean) {
  set(state.map((notification) => (notification.id === id ? { ...notification, read } : notification)));
}

export function markAllRead() {
  set(state.map((notification) => (notification.read ? notification : { ...notification, read: true })));
}

/** Removes a notification; the returned function puts it back where it was (for Undo). */
export function dismiss(id: string) {
  const index = state.findIndex((notification) => notification.id === id);
  if (index === -1) return () => {};
  const removed = state[index];
  set(state.filter((notification) => notification.id !== id));
  return () => {
    if (state.some((notification) => notification.id === id)) return;
    const next = [...state];
    next.splice(Math.min(index, next.length), 0, removed);
    set(next);
  };
}
