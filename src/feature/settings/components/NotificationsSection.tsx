"use client";

import { useState } from "react";
import { Switch } from "@/src/shared/ui/Switch";
import { SettingsRow, SettingsSection } from "./SettingsSection";

type Topic = "deadlines" | "applications" | "matches";
type Channel = "email" | "inApp";
type Preferences = Record<Topic, Record<Channel, boolean>>;

const TOPICS: { key: Topic; label: string; help: string }[] = [
  { key: "deadlines", label: "Deadline reminders", help: "14, 7, 3, and 1 days before each deadline" },
  { key: "applications", label: "Application updates", help: "Documents you still need and reviews ready" },
  { key: "matches", label: "New matches", help: "When strong matches are added" },
];

const CHANNELS: { key: Channel; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "inApp", label: "In-app" },
];

// TODO: load and save these once the API has notification preferences. Local state only for
// now, so changes reset on reload.
const DEFAULT_PREFERENCES: Preferences = {
  deadlines: { email: true, inApp: true },
  applications: { email: true, inApp: true },
  matches: { email: false, inApp: true },
};

export function NotificationsSection() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const toggle = (topic: Topic, channel: Channel, on: boolean) =>
    setPreferences((prev) => ({ ...prev, [topic]: { ...prev[topic], [channel]: on } }));

  return (
    <SettingsSection
      id="notifications"
      title="Notifications"
      description="Choose what we tell you about, and where."
    >
      {TOPICS.map(({ key, label, help }) => {
        const labelId = `notify-${key}-label`;
        return (
          <SettingsRow key={key} label={label} labelId={labelId} help={help}>
            <div className="flex flex-wrap gap-x-8 gap-y-1 md:justify-end">
              {CHANNELS.map((channel) => (
                <Switch
                  key={channel.key}
                  label={channel.label}
                  contextId={labelId}
                  checked={preferences[key][channel.key]}
                  onChange={(on) => toggle(key, channel.key, on)}
                />
              ))}
            </div>
          </SettingsRow>
        );
      })}
    </SettingsSection>
  );
}
