"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import Button from "@/src/shared/ui/Button";
import { GoogleIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";
import { smoothScrollToHash } from "@/src/shared/lib/scroll";
import {
  PROVIDER_NAMES,
  connectProvider,
  disconnectProvider,
  type LoginMethods,
  type Provider,
} from "../services/accountService";
import { PASSWORD_ROW_ID } from "./AccountSection";
import { ConfirmDialog } from "./ConfirmDialog";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import { useTranslations } from "next-intl";

const PROVIDERS: Provider[] = ["google", "linkedin"];

const ICONS: Record<Provider, ReactNode> = {
  google: <GoogleIcon className="size-4.5" />,
  linkedin: <LinkedInIcon className="size-4 text-brand-linkedin" />,
};

interface ConnectedAccountsSectionProps {
  /** The account's email; a newly connected provider is shown as connected with it. */
  email: string;
  loginMethods: LoginMethods;
  onChange: (update: (prev: LoginMethods) => LoginMethods) => void;
  /** Opens the password form in the Account section (the lockout note's link). */
  onSetPassword: () => void;
}

export function ConnectedAccountsSection({
  email,
  loginMethods,
  onChange,
  onSetPassword,
}: ConnectedAccountsSectionProps) {
  const t = useTranslations("settings");
  const [connecting, setConnecting] = useState<Provider | null>(null);
  const [confirming, setConfirming] = useState<Provider | null>(null);
  const connectedCount = Object.keys(loginMethods.providers).length;

  const connect = async (provider: Provider) => {
    setConnecting(provider);
    try {
      await connectProvider(provider);
      // TODO: use the email the provider returns; the account email stands in until OAuth exists.
      onChange((prev) => ({ ...prev, providers: { ...prev.providers, [provider]: email } }));
    } finally {
      setConnecting(null);
    }
  };

  const disconnect = async (provider: Provider) => {
    await disconnectProvider(provider);
    onChange((prev) => {
      const providers = { ...prev.providers };
      delete providers[provider];
      return { ...prev, providers };
    });
    setConfirming(null);
  };

  const goToPassword = (event: MouseEvent) => {
    smoothScrollToHash(event, `#${PASSWORD_ROW_ID}`);
    onSetPassword();
  };

  return (
    <>
      <SettingsSection
        id="connected-accounts"
        title={t("sections.connected-accounts")}
        description={t("connected.description")}
      >
        {PROVIDERS.map((provider) => {
          const name = PROVIDER_NAMES[provider];
          const connectedAs = loginMethods.providers[provider];
          // Disconnecting the only way in would lock the account out.
          const locked = Boolean(connectedAs) && !loginMethods.hasPassword && connectedCount === 1;
          const lockNoteId = `${provider}-lockout-note`;
          const busy = connecting === provider;

          return (
            <SettingsRow
              key={provider}
              label={
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex justify-center items-center bg-white border border-neutral-100 rounded-full size-9 shrink-0"
                  >
                    {ICONS[provider]}
                  </span>
                  {name}
                </span>
              }
              help={
                <>
                  <p className="break-all">{connectedAs ? t("connected.connectedAs", { email: connectedAs }) : t("connected.notConnected")}</p>
                  {locked && (
                    <p id={lockNoteId} className="text-caption">
                      {t.rich("connected.lockout", {
                        link: (chunks) => (
                          <a
                            href={`#${PASSWORD_ROW_ID}`}
                            onClick={goToPassword}
                            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 font-medium text-primary-800 underline underline-offset-2"
                          >
                            {chunks}
                          </a>
                        ),
                      })}
                    </p>
                  )}
                </>
              }
            >
              {/* One button for both states, so focus comes back to it after the dialog. */}
              <Button
                type="button"
                variant={connectedAs ? "ghost" : "soft"}
                className={cn(connectedAs && "text-neutral-800")}
                disabled={locked || busy}
                aria-describedby={locked ? lockNoteId : undefined}
                aria-label={connectedAs ? t("connected.disconnectItem", { name }) : t("connected.connectItem", { name })}
                onClick={() => (connectedAs ? setConfirming(provider) : connect(provider))}
              >
                {connectedAs ? t("connected.disconnect") : busy ? t("connected.connecting") : t("connected.connect")}
              </Button>
            </SettingsRow>
          );
        })}
      </SettingsSection>

      <ConfirmDialog
        open={confirming !== null}
        title={confirming ? t("connected.confirmTitle", { name: PROVIDER_NAMES[confirming] }) : ""}
        onClose={() => setConfirming(null)}
        onConfirm={() => (confirming ? disconnect(confirming) : Promise.resolve())}
        confirmLabel={t("connected.disconnect")}
        busyLabel={t("connected.disconnecting")}
      >
        {confirming && (
          <p>
            {t("connected.confirmBody", { name: PROVIDER_NAMES[confirming] })}
          </p>
        )}
      </ConfirmDialog>
    </>
  );
}
