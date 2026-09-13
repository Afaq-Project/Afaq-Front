"use client";

import { useRouter } from "next/navigation";

import Badge from "@/src/shared/ui/Badge";
import { Avatar } from "@/src/shared/ui/Avatar";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import { ManagedUser } from "../types/user";
import { TIER_TONE } from "../types/status";
import { formatDate } from "../services/utils";
import { SignupMethodIcon } from "./SignupMethodIcon";

export function UserRow({ user }: { user: ManagedUser }) {
  const router = useRouter();

  function goToDetail() {
    router.push(`/admin/users/${user.id}`);
  }

  return (
    <tr
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetail();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${user.name}`}
      className="hover:bg-primary-50/40 border-neutral-100 border-t even:bg-neutral-50 cursor-pointer"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div>
            <p className="font-medium text-neutral-900 text-small">{user.name}</p>
            <p className="text-neutral-500 text-caption">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-neutral-700 text-small">
          <SignupMethodIcon method={user.signupMethod} />
          {user.signupMethod}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge tone={TIER_TONE[user.tier]}>{user.tier}</Badge>
      </td>
      <td className="px-5 py-4 min-w-32">
        <div className="flex items-center gap-2">
          <ProgressBar value={user.profileCompletionPct} className="w-16" />
          <span className="text-neutral-700 text-caption whitespace-nowrap">
            {user.profileCompletionPct}%
          </span>
        </div>
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {formatDate(user.signupDate)}
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {formatDate(user.lastActiveDate)}
      </td>
    </tr>
  );
}
