import {
  CircleUserRound,
  ClipboardList,
  Compass,
  CreditCard,
  Gauge,
  House,
  Settings,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { DASHBOARD_METRICS } from "@/src/feature/admin/dashboard/mocks/dashboardMetrics";
import type messages from "@/src/messages/en.json";

/** Message keys under shell.nav and shell.menu; the components translate them. */
type ShellMessages = (typeof messages)["shell"];
export type NavLabelKey = `nav.${keyof ShellMessages["nav"]}`;
export type MenuLabelKey = `menu.${keyof ShellMessages["menu"]}`;

export type ShellVariant = "user" | "admin";

/** Global search isn't wired to anything yet; hooking it to /discover?q= is a separate task. */
export const SHOW_GLOBAL_SEARCH = false;

/**
 * For views that fill the screen below the top bar on tablet and up (chat layouts):
 * 100dvh minus the 60px bar and the main area's padding (24px top below 1024px, 32px from
 * there; 24px bottom).
 */
export const SHELL_FILL_HEIGHT = "md:h-[calc(100dvh-108px)] lg:h-[calc(100dvh-116px)]";

/** Ghost icon button in the top bar: 40×40, with a 44×44 hit area for touch. */
export const ICON_BUTTON_CLASS =
  "relative inline-flex justify-center items-center rounded-md size-10 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 after:absolute after:-inset-0.5 after:content-['']";

export interface NavItem {
  href: string;
  labelKey: NavLabelKey;
  icon: LucideIcon;
  /** Count shown beside the label: pending approvals, read out as "N pending". */
  badge?: number;
  /** The mobile tab bar fits four tabs; anything beyond moves into the user menu. */
  menuOnMobile?: boolean;
}

export interface MenuItem {
  href: string;
  labelKey: NavLabelKey | MenuLabelKey;
  icon: LucideIcon;
  mobileOnly?: boolean;
}

export const HOME_HREF: Record<ShellVariant, string> = {
  user: "/dashboard",
  admin: "/admin/dashboard",
};

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", labelKey: "nav.dashboard", icon: Gauge },
  {
    href: "/admin/opportunities/approval-queue",
    labelKey: "nav.approvals",
    icon: ShieldCheck,
    // TODO: read from the admin metrics API once it exists; this is the same mock the admin dashboard shows.
    badge: DASHBOARD_METRICS.pendingApprovalCount,
  },
  { href: "/admin/opportunities/manage", labelKey: "nav.opportunities", icon: Settings2 },
  { href: "/admin/users", labelKey: "nav.users", icon: Users },
  { href: "/admin/subscriptions", labelKey: "nav.subscriptions", icon: CreditCard, menuOnMobile: true },
];

export const NAV_ITEMS: Record<ShellVariant, NavItem[]> = {
  user: [
    { href: "/dashboard", labelKey: "nav.home", icon: House },
    { href: "/discover", labelKey: "nav.discover", icon: Compass },
    { href: "/applications", labelKey: "nav.applications", icon: ClipboardList },
    { href: "/ai", labelKey: "nav.ai", icon: Sparkles },
  ],
  admin: ADMIN_NAV,
};

export const MENU_ITEMS: Record<ShellVariant, MenuItem[]> = {
  user: [
    { href: "/profile", labelKey: "menu.profile", icon: CircleUserRound },
    { href: "/billing", labelKey: "menu.billing", icon: CreditCard },
    { href: "/settings", labelKey: "menu.settings", icon: Settings },
  ],
  // No Settings: /settings lives in the student-only route group and redirects admins away.
  admin: ADMIN_NAV.filter((item) => item.menuOnMobile).map(({ href, labelKey, icon }) => ({
    href,
    labelKey,
    icon,
    mobileOnly: true,
  })),
};

export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
