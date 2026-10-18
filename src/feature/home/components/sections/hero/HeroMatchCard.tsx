import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { content } from "../../../content/en";
import { Card } from "../../ui/Card";
import { Chip } from "../../ui/Chip";
import { FlagTile } from "../../ui/FlagTile";
import { MatchBadge } from "../../ui/MatchBadge";

/**
 * Decorative example match: scholarship, match percentage and the requirements it meets as
 * checked chips. Hidden from assistive tech; the hero text says the same thing.
 * 300px wide (266px inside). The meta row wraps if it ever runs out of room, so the badge
 * drops below the meta instead of truncating it.
 */
type MatchCardContent = typeof content.hero.matchCard;

export function HeroMatchCard({ card = content.hero.matchCard, className }: { card?: MatchCardContent; className?: string }) {
  return (
    <Card
      aria-hidden="true"
      floating
      className={cn(
        "flex flex-col gap-3 p-4 lg:p-4 w-75 pointer-events-none select-none",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <FlagTile code={card.countryCode} size="sm" />
        <p className="font-medium text-landing-small text-neutral-900 line-clamp-1">
          {card.title}
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1.5">
        <span className="text-landing-caption text-neutral-600">
          {card.meta}
        </span>
        <MatchBadge percent={card.percent} />
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {card.criteria.map((criterion) => (
          <li key={criterion}>
            <Chip className="bg-neutral-50">
              <Check
                size={12}
                strokeWidth={2.25}
                className="text-primary-600 shrink-0"
              />
              {criterion}
            </Chip>
          </li>
        ))}
      </ul>
    </Card>
  );
}
