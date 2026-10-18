"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import hero1 from "@/public/hero/hero-1.jpg";
import hero2 from "@/public/hero/hero-2.jpg";
import hero3 from "@/public/hero/hero-3.jpg";
import { content } from "../../../content/en";

/** Each photo with the crop focus that keeps its people in frame (alt text comes from content). */
const PHOTOS: { src: StaticImageData; position: string }[] = [
  { src: hero1, position: "60% 70%" },
  { src: hero2, position: "50% 75%" },
  { src: hero3, position: "55% 75%" },
];

const INTERVAL_MS = 5000;
const SIZES = "(min-width: 1024px) 560px, 100vw";

/**
 * Hero slideshow: 4:3, 5:4 from 1024px, cropped to fill. Slides toward the inline-start every 5s
 * and loops 1 → 2 → 3 → 1: after the last photo it slides onto a copy of the first, then jumps
 * back to the real first one without animating. Pauses while the tab is hidden; with reduced
 * motion it stays on the first photo. Never mirrored.
 */
export function HeroPhoto() {
  const { photos } = content.hero;
  /** 0..PHOTOS.length; PHOTOS.length is the copy of the first photo. */
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const playing = !reducedMotion && !tabHidden;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((current) => Math.min(current + 1, PHOTOS.length)), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  // After the instant jump back to the first photo, turn the slide transition back on.
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  function onTransitionEnd() {
    if (index !== PHOTOS.length) return;
    setAnimate(false);
    setIndex(0);
  }

  const slides = [...PHOTOS, PHOTOS[0]];

  return (
    <div className="relative bg-primary-100 border border-neutral-100 rounded-lg aspect-4/3 lg:aspect-5/4 overflow-hidden animate-landing-fade motion-reduce:animate-none">
      <div
        onTransitionEnd={onTransitionEnd}
        style={{ "--slide": index } as CSSProperties}
        className={cn(
          "flex h-full",
          "[transform:translateX(calc(var(--slide)*-100%))] rtl:[transform:translateX(calc(var(--slide)*100%))]",
          animate && "transition-transform duration-700 ease-in-out motion-reduce:transition-none",
        )}
      >
        {slides.map((photo, slide) => {
          const isCopy = slide === PHOTOS.length;
          const visible = slide === index;
          return (
            <div key={slide} aria-hidden={!visible || isCopy ? true : undefined} className="relative w-full h-full shrink-0">
              <Image
                src={photo.src}
                alt={isCopy ? "" : photos[slide].alt}
                fill
                priority={slide === 0}
                loading={slide === 0 ? undefined : "eager"}
                placeholder="blur"
                sizes={SIZES}
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
