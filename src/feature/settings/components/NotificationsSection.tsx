"use client";

import { useState } from "react";
import { Switch } from "@/src/shared/ui/Switch";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import { useTranslations } from "next-intl";

type Topic = "deadlines" | "applications" | "matches";
type Channel = "email" | "inApp";
type Preferences = Record<Topic, Record<Channel, boolean>>;

// Labels are settings.notifications.topics.<topic> (and <topic>Help) and .channels.<channel>.
const TOPICS: Topic[] = ["deadlines", "applications", "matches"];
const CHANNELS: Channel[] = ["email", "inApp"];

// TODO: load and save these once the API has notification preferences. Local state only for
// now, so changes reset on reload.
const DEFAULT_PREFERENCES: Preferences = {
  deadlines: { email: true, inApp: true },
  applications: { email: true, inApp: true },
  matches: { email: false, inApp: true },
};

export function NotificationsSection() {
  const t = useTranslations("settings");
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const toggle = (topic: Topic, channel: Channel, on: boolean) =>
    setPreferences((prev) => ({ ...prev, [topic]: { ...prev[topic], [channel]: on } }));

  return (
    <SettingsSection
      id="notifications"
      title={t("sections.notifications")}
      description={t("notifications.description")}
    >
      {TOPICS.map((key) => {
        const labelId = `notify-${key}-label`;
        return (
          <SettingsRow
            key={key}
            label={t(`notifications.topics.${key}`)}
            labelId={labelId}
            help={t(`notifications.topics.${key}Help`)}
          >
            <div className="flex flex-wrap gap-x-8 gap-y-1 md:justify-end">
              {CHANNELS.map((channel) => (
                <Switch
                  key={channel}
                  label={t(`notifications.channels.${channel}`)}
                  contextId={labelId}
                  checked={preferences[key][channel]}
                  onChange={(on) => toggle(key, channel, on)}
                />
              ))}
            </div>
          </SettingsRow>
        );
      })}
    </SettingsSection>
  );
}
