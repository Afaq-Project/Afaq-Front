"use client";

import { useState } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { INITIAL_LOGIN_METHODS } from "../services/accountService";
import { AccountSection } from "./AccountSection";
import { ConnectedAccountsSection } from "./ConnectedAccountsSection";
import { LanguageSection } from "./LanguageSection";
import { NotificationsSection } from "./NotificationsSection";
import { PlanSection } from "./PlanSection";
import { PrivacySupportSection } from "./PrivacySupportSection";
import { SettingsNav, type SettingsNavItem } from "./SettingsNav";
import { useTranslations } from "next-intl";

// Labels are settings.sections.<id>.
const SECTION_IDS = ["account", "plan", "notifications", "language", "connected-accounts", "privacy-support"] as const;

/** Settings: a sticky section nav (1024px and up) beside one card per section. */
export function SettingsView() {
  const t = useTranslations("settings");
  const sections: SettingsNavItem[] = SECTION_IDS.map((id) => ({ id, label: t(`sections.${id}`) }));
  const { user } = useAuth();
  const email = user?.email ?? "";
  // Shared by the password row (set vs. change) and connected accounts (the lockout guard).
  const [loginMethods, setLoginMethods] = useState(INITIAL_LOGIN_METHODS);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-h1 text-neutral-900">{t("title")}</h1>
        <p className="mt-1 text-body text-neutral-600">{t("subtitle")}</p>
      </header>

      <div className="lg:items-start gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <SettingsNav items={sections} />

        <div className="flex flex-col gap-4 min-w-0">
          <AccountSection
            email={email}
            loginMethods={loginMethods}
            onPasswordSet={() => setLoginMethods((prev) => ({ ...prev, hasPassword: true }))}
            passwordFormOpen={passwordFormOpen}
            onPasswordFormOpenChange={setPasswordFormOpen}
          />
          <PlanSection />
          <NotificationsSection />
          <LanguageSection />
          <ConnectedAccountsSection
            email={email}
            loginMethods={loginMethods}
            onChange={setLoginMethods}
            onSetPassword={() => setPasswordFormOpen(true)}
          />
          <PrivacySupportSection email={email} />
        </div>
      </div>
    </div>
  );
}
