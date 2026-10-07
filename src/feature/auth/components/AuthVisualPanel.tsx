import Image from "next/image";
import AuthFeatureList from "./AuthFeatureList";

interface AuthVisualPanelProps {
  headline: string;
  subline: string;
}

export default function AuthVisualPanel({
  headline,
  subline,
}: AuthVisualPanelProps) {
  return (
    <section className="relative flex flex-col bg-primary-50 p-8 xl:p-10 rounded-lg h-full overflow-hidden [container-type:size]">
      <Image
        src="/signup-img.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 560px, 0px"
        className="object-cover"
      />
      {/* Soft wash behind the headline only, so the photo stays visible behind the feature card. */}
      <div className="top-0 absolute inset-x-0 bg-linear-to-b from-white/85 via-white/75 via-65% to-transparent h-[55%]" />

      <div className="relative flex flex-col flex-1">
        <h2 className="max-w-[16ch] text-hero text-primary-900">{headline}</h2>
        <p className="mt-4 max-w-sm text-body text-neutral-800">{subline}</p>
        {/* Hidden rather than overlapping when the panel is too short (needs ~520px of content height, measured). */}
        <div className="mt-auto pt-8 [@container(max-height:530px)]:hidden">
          <AuthFeatureList />
        </div>
      </div>
    </section>
  );
}
