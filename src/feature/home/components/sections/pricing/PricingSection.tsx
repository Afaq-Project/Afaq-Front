import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { APP_SIGNUP_URL, type SectionTone } from "../../../constants";
import { content, type PricingPlan } from "../../../content/en";
import { Section } from "../../layout/Section";
import { SectionHeader } from "../../layout/SectionHeader";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

const TITLE_ID = "pricing-title";
const PLAN_HREF: Record<PricingPlan["id"], string> = {
  free: APP_SIGNUP_URL,
  premium: `${APP_SIGNUP_URL}?plan=premium`,
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

/**
 * One plan. Premium gets the section's primary button and is highlighted by a 2px green border
 * only (no badge): its 1px border plus a 1px ring, so both cards lay out identically and their
 * buttons line up. Free gets a secondary button. Buttons are pinned to the bottom of each card.
 */
function PlanCard({ plan }: { plan: PricingPlan }) {
  const { pricing } = content;
  const premium = plan.id === "premium";

  return (
    <Card className={cn("flex flex-col p-7 lg:p-7 h-full", premium && "border-primary-600 ring-1 ring-primary-600")}>
      <h3 className={cn("font-semibold text-landing-small", premium ? "text-primary-800" : "text-neutral-900")}>{plan.label}</h3>
      <p className="flex items-baseline gap-1.5 mt-2">
        <span className="font-semibold text-[40px] text-neutral-900 leading-12">{formatPrice(plan.monthlyPrice)}</span>
        <span className="text-landing-small text-neutral-600">{plan.monthlyPrice === 0 ? pricing.forever : pricing.perMonth}</span>
      </p>
      {plan.annualPrice !== undefined && (
        <p className="text-landing-caption text-neutral-600">{pricing.perYear.replace("{price}", formatPrice(plan.annualPrice))}</p>
      )}
      <p className="mt-2 text-landing-small text-neutral-600">{plan.description}</p>

      <ul className="flex flex-col gap-3 mt-6 pt-6 border-neutral-100 border-t">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-landing-small text-neutral-800">
            <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 text-primary-600 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button href={PLAN_HREF[plan.id]} variant={premium ? "primary" : "secondary"} className="w-full">
          {plan.cta}
        </Button>
      </div>
    </Card>
  );
}

/** Pricing: two equal-height plan cards centered as a pair (max 880px), Free first; one column below 768px. */
export function PricingSection({ id, tone }: { id: string; tone: SectionTone }) {
  const { pricing } = content;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID}>
      <SectionHeader align="center" titleId={TITLE_ID} eyebrow={pricing.eyebrow} title={pricing.title} intro={pricing.intro} />

      <ul className="gap-6 grid md:grid-cols-2 mx-auto max-w-220">
        {pricing.plans.map((plan) => (
          <li key={plan.id}>
            <PlanCard plan={plan} />
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-8 max-w-[60ch] text-landing-caption text-neutral-600 text-center">{pricing.footnote}</p>
    </Section>
  );
}
