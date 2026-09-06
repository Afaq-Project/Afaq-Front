"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, UserCircle } from "lucide-react";

const tabs = [
    { label: "Opportunities", href: "/opportunities" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "My Status", href: "/documents" },
] as const;

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="border-b border-stone-200 bg-[#FAF8F3]">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-10">
                    <span className="text-xl font-bold text-green-800">Levora</span>
                    <nav className="flex items-center gap-8">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`text-sm pb-1 border-b-2 transition-colors ${pathname === tab.href
                                        ? "border-green-800 text-stone-900 font-medium"
                                        : "border-transparent text-stone-500 hover:text-stone-800"
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4 text-stone-700">
                    <button type="button" aria-label="Notifications">
                        <Bell className="h-5 w-5" />
                    </button>
                    <button type="button" aria-label="Profile">
                        <UserCircle className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}