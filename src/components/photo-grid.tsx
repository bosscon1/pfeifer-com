import { useCallback, useState } from "react";
import { Lightbox, type LightboxPhoto } from "@/components/lightbox";
import { withBase } from "@/lib/preview-base";

export function PhotoGrid({
  items,
  heading = "Photos of completed projects",
  lede = "Representative work in Fayette and Coweta. Ask to see jobs in your neighborhood.",
  layout = "grid",
}: {
  items: LightboxPhoto[];
  heading?: string;
  lede?: string;
  layout?: "grid" | "masonry";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const last = items.length - 1;
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : i === 0 ? last : i - 1)), [last]);
  const next = useCallback(() => setOpen((i) => (i === null ? i : i === last ? 0 : i + 1)), [last]);

  if (items.length === 0) return null;

  const masonry = layout === "masonry";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl text-ink">{heading}</h2>
        <p className="mt-2 text-sm text-muted">{lede}</p>
        <div
          className={
            masonry
              ? "mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3"
              : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {items.map((item, i) => (
            <figure
              key={item.src + item.alt}
              className={masonry ? "mb-4 break-inside-avoid overflow-hidden bg-cream" : "overflow-hidden bg-cream"}
            >
              <button
                type="button"
                className="block w-full cursor-zoom-in text-left"
                onClick={() => setOpen(i)}
                aria-label={`View larger: ${item.alt}`}
              >
                <img
                  src={withBase(item.src)}
                  alt={item.alt}
                  className={masonry ? "block w-full" : "aspect-16/10 w-full object-cover"}
                />
              </button>
            </figure>
          ))}
        </div>
      </div>
      {open !== null ? (
        <Lightbox items={items} index={open} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </section>
  );
}
