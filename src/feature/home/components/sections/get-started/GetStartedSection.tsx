import Image from "next/image";
import { HorizonLines } from "@/src/shared/ui/HorizonLines";
import { APP_SIGNUP_URL, type SectionTone } from "../../../constants";
import { useLandingContent } from "../../../content";
import { Section } from "../../layout/Section";
import { Button } from "../../ui/Button";

const TITLE_ID = "get-started-title";

/**
 * Final call to action: a green-50 panel with the horizon lines across its lower 38% (kept below
 * the text, passing only behind the button), and the logo mark, title, text and the sign-up
 * button, centered. Bottom padding is 64px since the footer follows.
 */
export function GetStartedSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { getStarted } = content;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID} className="pb-16 md:pb-16 lg:pb-16">
      <div className="isolate relative flex flex-col items-center bg-primary-50 px-5 lg:px-8 py-12 lg:py-18 rounded-lg lg:rounded-[28px] overflow-hidden text-center">
        <HorizonLines variant="arc" className="-z-10 bottom-0 absolute inset-x-0 h-[38%]" />

        {/* The image has ~14% transparent padding, so 64px gives a ~46px visible mark. */}
        <Image src="/afaq.png" alt="" width={64} height={64} className="-my-2 size-16" />
        <h2 id={TITLE_ID} className="mt-4 max-w-[20ch] text-landing-h2 text-neutral-900 text-balance">
          {getStarted.title}
        </h2>
        <p className="mt-4 max-w-[48ch] text-landing-body-lg text-neutral-600">{getStarted.text}</p>
        <Button href={APP_SIGNUP_URL} variant="primary" className="mt-8 w-full min-[480px]:w-auto">
          {getStarted.primaryCta}
        </Button>
      </div>
    </Section>
  );
}
