import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";

import Card from "@/src/shared/ui/Card";

export function QuickLinksCard({
  officialSiteUrl,
  supportEmail,
}: {
  officialSiteUrl: string;
  supportEmail: string;
}) {
  return (
    <Card>
      <h2 className="text-h2">Quick Links</h2>

      <div className="flex flex-col gap-1 mt-4">
        <Link
          href={officialSiteUrl}
          target="_blank"
          className="flex justify-between items-center hover:bg-neutral-50 -mx-2 px-2 py-2.5 rounded-md text-neutral-800 text-small transition-colors"
        >
          Official University Site
          <ExternalLink
            size={16}
            strokeWidth={2.5}
            className="text-primary-400"
          />
        </Link>
        <a
          href={`mailto:${supportEmail}`}
          className="flex justify-between items-center hover:bg-neutral-50 -mx-2 px-2 py-2.5 rounded-md text-neutral-800 text-small transition-colors"
        >
          Contact Support
          <Mail size={16} strokeWidth={2.5} className="text-primary-400" />
        </a>
      </div>
    </Card>
  );
}
