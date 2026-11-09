import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { Page } from "@/lib/content";

type Props = {
  photos: NonNullable<Page["fieldwork"]>["photos"];
};

/** On-site installation photos with captions, cropped to a common 4:3 frame. */
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
            </div>
            <figcaption className="px-5 py-4 text-sm font-medium">{photo.caption}</figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
