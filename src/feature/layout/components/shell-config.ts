import {
  CircleUserRound,
  ClipboardList,
  Compass,
  CreditCard,
  FolderOpen,
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
  label: string;
  icon: LucideIcon;
  /** Count shown beside the label, e.g. pending approvals. */
  badge?: number;
  badgeLabel?: string;
  /** The mobile tab bar fits four tabs; anything beyond moves into the user menu. */
  menuOnMobile?: boolean;
}

export interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  mobileOnly?: boolean;
}

export const HOME_HREF: Record<ShellVariant, string> = {
  user: "/dashboard",
  admin: "/admin/dashboard",
};

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  {
    href: "/admin/opportunities/approval-queue",
    label: "Approvals",
    icon: ShieldCheck,
    // TODO: read from the admin metrics API once it exists; this is the same mock the admin dashboard shows.
    badge: DASHBOARD_METRICS.pendingApprovalCount,
    badgeLabel: "pending",
  },
  { href: "/admin/opportunities/manage", label: "Opportunities", icon: Settings2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard, menuOnMobile: true },
];

export const NAV_ITEMS: Record<ShellVariant, NavItem[]> = {
  user: [
    { href: "/dashboard", label: "Home", icon: House },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/applications", label: "Applications", icon: ClipboardList },
    { href: "/ai", label: "AI assistant", icon: Sparkles },
  ],
  admin: ADMIN_NAV,
};

export const MENU_ITEMS: Record<ShellVariant, MenuItem[]> = {
  user: [
    { href: "/profile", label: "Your profile", icon: CircleUserRound },
    { href: "/documents", label: "Your documents", icon: FolderOpen },
    { href: "/billing", label: "Subscription", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  // No Settings: /settings lives in the student-only route group and redirects admins away.
  admin: ADMIN_NAV.filter((item) => item.menuOnMobile).map(({ href, label, icon }) => ({
    href,
    label,
    icon,
    mobileOnly: true,
  })),
};

export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
