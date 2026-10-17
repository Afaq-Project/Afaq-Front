import Image from "next/image";
import type { MouseEvent } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { content } from "../../content/en";

/**
 * The Afaq mark (/public/afaq.png). The image has ~14% transparent padding around the tile, so
 * it renders at 40px (a ~29px visible tile) and the negative start margin lines the tile up with
 * the container edge. Never mirrored.
 */
function LogoMark() {
  return <Image src="/afaq.png" alt="" width={40} height={40} className="-ms-1.5 size-10 shrink-0" />;
}

/** Mark + wordmark, linking to the top of the page. */
export function Logo({ onClick, className }: { onClick?: (event: MouseEvent<HTMLAnchorElement>) => void; className?: string }) {
  return (
    <a
      href="#top"
      aria-label={content.nav.homeLabel}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm min-h-11 shrink-0",
        "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2",
        className,
      )}
    >
      <LogoMark />
      <span className="font-semibold text-landing-h3 text-neutral-900">{content.nav.brand}</span>
    </a>
  );
}
