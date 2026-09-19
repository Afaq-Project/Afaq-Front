import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import Badge from "@/src/shared/ui/Badge";
import { Avatar } from "@/src/shared/ui/Avatar";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import { ManagedUser } from "../types/user";
import { TIER_TONE, FREE_TIER_AI_LIMITS } from "../types/status";
import {
  formatChatMessagesUsage,
  formatDate,
  formatEssayReviewsUsage,
} from "../services/utils";
import { SignupMethodIcon } from "./SignupMethodIcon";

export function UserDetailView({ user }: { user: ManagedUser }) {
  const isPremium = user.tier === "Premium";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 w-fit text-neutral-600 hover:text-neutral-900 text-small transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to users
      </Link>

      <Card className="max-w-3xl">
        <Card.Header className="flex sm:flex-row flex-col sm:items-center gap-4">
          <Avatar name={user.name} className="w-12 h-12" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h2">{user.name}</h1>
              <Badge tone={TIER_TONE[user.tier]}>{user.tier}</Badge>
            </div>
            <p className="text-neutral-600 text-small">{user.email}</p>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 text-caption">
            <SignupMethodIcon method={user.signupMethod} />
            Signed up with {user.signupMethod}
          </div>
        </Card.Header>

        <Card.Body className="flex flex-col gap-6">
          <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
            <div>
              <p className="text-neutral-500 text-caption uppercase tracking-wide">
                Signup date
              </p>
              <p className="mt-1 font-medium text-neutral-900 text-small">
                {formatDate(user.signupDate)}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-caption uppercase tracking-wide">
                Last active
              </p>
              <p className="mt-1 font-medium text-neutral-900 text-small">
                {formatDate(user.lastActiveDate)}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-caption uppercase tracking-wide">
                Applications submitted
              </p>
              <p className="mt-1 font-medium text-neutral-900 text-small">
                {user.applicationCount}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-neutral-800 text-caption uppercase tracking-wide">
              Profile completion
            </p>
            <div className="flex items-center gap-3 max-w-xs">
              <ProgressBar value={user.profileCompletionPct} className="flex-1" />
              <span className="text-neutral-700 text-small">{user.profileCompletionPct}%</span>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-neutral-800 text-caption uppercase tracking-wide">
              Profile summary
            </p>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
              <div>
                <p className="text-neutral-500 text-caption">Education level</p>
                <p className="mt-0.5 text-neutral-900 text-small">{user.educationLevel}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-caption">Field of study</p>
                <p className="mt-0.5 text-neutral-900 text-small">{user.fieldOfStudy}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-caption">Nationality</p>
                <p className="mt-0.5 text-neutral-900 text-small">{user.nationality}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-neutral-800 text-caption uppercase tracking-wide">
              AI usage this month
            </p>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-neutral-50 p-3 rounded-sm">
                <p className="text-neutral-500 text-caption">Essay reviews used</p>
                <p className="mt-0.5 font-medium text-neutral-900 text-small">
                  {formatEssayReviewsUsage(user)}
                </p>
                {!isPremium && (
                  <ProgressBar
                    value={(user.aiUsage.essayReviewsUsed / FREE_TIER_AI_LIMITS.essayReviews) * 100}
                    className="mt-2"
                  />
                )}
              </div>
              <div className="bg-neutral-50 p-3 rounded-sm">
                <p className="text-neutral-500 text-caption">Chat messages used</p>
                <p className="mt-0.5 font-medium text-neutral-900 text-small">
                  {formatChatMessagesUsage(user)}
                </p>
                {!isPremium && (
                  <ProgressBar
                    value={(user.aiUsage.chatMessagesUsed / FREE_TIER_AI_LIMITS.chatMessages) * 100}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
