import { HorizonLines } from "@/src/shared/ui/HorizonLines";

/**
 * Decorative "horizon" backdrop for the auth pages: a soft green glow at the bottom
 * center with thin curved lines over it. Fixed behind the content, static (no animation).
 */
export default function AuthBackground() {
  return (
    <div aria-hidden="true" className="-z-10 fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,var(--color-primary-50),transparent)]" />
      <HorizonLines className="max-md:hidden bottom-0 absolute inset-x-0 h-[60dvh]" />
    </div>
  );
}
