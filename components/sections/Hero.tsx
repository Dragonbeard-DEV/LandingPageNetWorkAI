import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ImageRef } from "@/lib/content";

type Action = { label: string; href: string };

type Props = {
  titleLine1: string;
  titleLine2: string;
  lead: string;
  image: ImageRef;
  primary: Action;
  secondary: Action;
};

/** Full-width hero with a background photo. Not animated: it is the LCP element. */
export function Hero({ titleLine1, titleLine2, lead, image, primary, secondary }: Props) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      {/* Navy overlay (text-strong token) keeps white text above 4.5:1 on any part of the photo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-strong/85 via-strong/70 to-strong/40" />
      <Container className="flex min-h-[34rem] flex-col justify-center py-20 md:min-h-[40rem] md:py-28">
        <h1 id="hero-title" className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">{titleLine1}</span>
          <span className="block">{titleLine2}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white md:text-xl">{lead}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href={primary.href}>{primary.label}</Button>
          <Button href={secondary.href} variant="inverse">
            {secondary.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
