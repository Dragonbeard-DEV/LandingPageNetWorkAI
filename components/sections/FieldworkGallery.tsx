import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { Page } from "@/lib/content";

type Props = {
  photos: NonNullable<Page["fieldwork"]>["photos"];
};

/** Site photos labelled with the work shown and its project phase, cropped to a common 4:3 frame. */
export function FieldworkGallery({ photos }: Props) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <Reveal as="li" key={photo.src}>
          <figure className="overflow-hidden rounded-[var(--radius-card)] border border-border-soft bg-card shadow-card">
            <div className="relative aspect-[4/3]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-[#06142b]/80 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                {photo.phase}
              </span>
            </div>
            <figcaption className="px-5 py-4 font-semibold text-strong">{photo.title}</figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
