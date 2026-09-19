import PageHeader from "@/src/shared/ui/PageHeader";
import { ConnectedAccountsCard } from "./ConnectedAccountsCard";
import { DataPrivacyCard } from "./DataPrivacyCard";
import { NeedHelpCard } from "./NeedHelpCard";
import { SecurityPasswordCard } from "./SecurityPasswordCard";

export function SettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Account & Security"
        description="Update your password, manage connected accounts, and control your data."
      />

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2">
          <SecurityPasswordCard />
        </div>
        <NeedHelpCard />
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 items-stretch">
        <ConnectedAccountsCard />
        <DataPrivacyCard />
      </div>
    </div>
  );
}
