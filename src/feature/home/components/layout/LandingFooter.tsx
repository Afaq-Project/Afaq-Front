import { cn } from "@/src/feature/dashboard/services/utils";
import { InstagramIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";
import { APP_SIGNUP_URL, PRIVACY_URL, SOCIAL_LINKS, SUPPORT_EMAIL, TERMS_URL } from "../../constants";
import { content } from "../../content/en";
import { Logo } from "../nav/Logo";
import { Container } from "./Container";

const LINK = cn(
  "inline-flex items-center rounded-sm min-h-8 sm:min-h-0 text-landing-small text-neutral-600 hover:text-neutral-900 transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2",
);

const SOCIAL_ICONS = { linkedin: LinkedInIcon, instagram: InstagramIcon };

/** Configured social profiles only (SOCIAL_LINKS); renders nothing when none are set. */
function SocialLinks({ className }: { className?: string }) {
  const { footer } = content;
  const entries = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter((key) => SOCIAL_LINKS[key]);
  if (entries.length === 0) return null;

  return (
    <ul className={cn("flex gap-2", className)}>
      {entries.map((key) => {
        const Icon = SOCIAL_ICONS[key];
        return (
          <li key={key}>
            <a
              href={SOCIAL_LINKS[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={footer.social[key]}
              className="inline-flex justify-center items-center border border-neutral-100 hover:border-neutral-200 rounded-md size-10 text-neutral-600 hover:text-neutral-900 transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2"
            >
              <Icon className="size-4.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function LinkGroup({ title, links, className }: { title: string; links: { label: string; href: string }[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-semibold text-landing-small text-neutral-900">{title}</h2>
      <ul className="flex flex-col gap-0.5 sm:gap-2.5 mt-3">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={LINK}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Page footer: brand block, three link groups, configured social links, and a bottom bar.
 *  - From 1024px: brand (1.5fr) beside the three groups (1fr each).
 *  - 640–1023px: brand on top, the groups in three columns below.
 *  - Below 640px: brand, groups in two columns (Support spans both), then social links;
 *    links get a 32px tap height.
 */
export function LandingFooter() {
  const { footer } = content;
  const { product, scholarships, support } = footer.groups;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white pt-14 pb-8 border-neutral-100 border-t">
      <Container>
        <div className="gap-10 grid lg:grid-cols-[1.5fr_3fr]">
          <div className="flex flex-col items-start gap-3">
            <Logo />
            <p className="text-landing-small text-neutral-600">{footer.tagline}</p>
            <SocialLinks className="max-sm:hidden mt-2" />
          </div>

          <nav aria-label={footer.navLabel} className="gap-x-6 gap-y-8 grid grid-cols-2 sm:grid-cols-3">
            <LinkGroup title={product.title} links={product.links} />
            <LinkGroup
              title={scholarships.title}
              links={[
                { label: scholarships.openScholarships, href: "#scholarships" },
                { label: scholarships.signUp, href: APP_SIGNUP_URL },
              ]}
            />
            <LinkGroup
              title={support.title}
              className="max-sm:col-span-2"
              links={[
                { label: support.faq, href: "#faq" },
                { label: support.contact, href: `mailto:${SUPPORT_EMAIL}` },
                { label: support.privacy, href: PRIVACY_URL },
                { label: support.terms, href: TERMS_URL },
              ]}
            />
          </nav>

          <SocialLinks className="sm:hidden" />
        </div>

        <div className="flex md:flex-row flex-col md:justify-between gap-2 mt-12 pt-6 border-neutral-100 border-t text-landing-caption text-neutral-600">
          <p>{footer.copyright.replace("{year}", String(year))}</p>
          <p>{footer.note}</p>
        </div>
      </Container>
    </footer>
  );
}
