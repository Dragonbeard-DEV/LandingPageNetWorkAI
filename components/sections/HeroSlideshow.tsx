"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { ImageRef } from "@/lib/content";

export type HeroSlideshowLabels = {
  region: string;
  pause: string;
  play: string;
  /** Contains {number}, replaced with the 1-based slide number. */
  goToSlide: string;
};

type Props = {
  images: ImageRef[];
  labels: HeroSlideshowLabels;
};

const SLIDE_INTERVAL_MS = 6000;
// The next photo starts loading after the first one is on screen, so it never competes with the LCP image.
const NEXT_SLIDE_LOAD_DELAY_MS = 2500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Cross-fading hero background. The first photo is the LCP element and is server-rendered;
 * the rest load one step ahead of the rotation. Rotation pauses while the controls have the
 * pointer or focus, and only starts on its own when the visitor has not asked for reduced motion.
 */
export function HeroSlideshow({ images, labels }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedUpTo, setLoadedUpTo] = useState(0);
  const [playChoice, setPlayChoice] = useState<"play" | "pause" | null>(null);
  const [isPointerOverControls, setIsPointerOverControls] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

  const hasManySlides = images.length > 1;
  const wantsPlay = playChoice ? playChoice === "play" : !prefersReducedMotion;
  const isRotating = hasManySlides && wantsPlay && !isPointerOverControls && !hasKeyboardFocus;

  useEffect(() => {
    if (!isRotating) return;
    const timer = setTimeout(() => setActiveIndex((index) => (index + 1) % images.length), SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isRotating, activeIndex, images.length]);

  useEffect(() => {
    if (!wantsPlay || !hasManySlides) return;
    const timer = setTimeout(() => setLoadedUpTo((upTo) => Math.max(upTo, activeIndex + 1)), NEXT_SLIDE_LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [wantsPlay, hasManySlides, activeIndex]);

  return (
    <>
      <div className="absolute inset-0 -z-20 bg-strong">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          if (!isActive && index > loadedUpTo) return null;
          return (
            <Image
              key={image.src}
              src={image.src}
              alt={isActive ? image.alt : ""}
              aria-hidden={!isActive}
              fill
              preload={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              quality={60}
              sizes="100vw"
              data-active={isActive}
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                isActive ? "opacity-100" : "opacity-0",
              )}
            />
          );
        })}
      </div>

      {hasManySlides && (
        <Container className="absolute inset-x-0 bottom-5 md:bottom-8">
          <div
            role="group"
            aria-label={labels.region}
            className="flex w-fit items-center gap-1"
            onPointerEnter={() => setIsPointerOverControls(true)}
            onPointerLeave={() => setIsPointerOverControls(false)}
            // Keyboard focus only: a clicked button keeps focus, which would stop the rotation for good.
            onFocus={(event) => setHasKeyboardFocus(event.target.matches(":focus-visible"))}
            onBlur={() => setHasKeyboardFocus(false)}
          >
            <button
              type="button"
              onClick={() => setPlayChoice(wantsPlay ? "pause" : "play")}
              aria-label={wantsPlay ? labels.pause : labels.play}
              className="flex size-9 items-center justify-center rounded-full text-white hover:bg-white/15 focus-visible:outline-white"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                {wantsPlay ? <path d="M6 4h3v12H6zM11 4h3v12h-3z" /> : <path d="M6 4l10 6-10 6z" />}
              </svg>
            </button>
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={labels.goToSlide.replace("{number}", String(index + 1))}
                aria-current={index === activeIndex ? "true" : undefined}
                className="group flex size-9 items-center justify-center rounded-full focus-visible:outline-white"
              >
                <span className={cn("h-1 w-6 rounded-full transition-colors group-hover:bg-white", index === activeIndex ? "bg-white" : "bg-white/50")} />
              </button>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
