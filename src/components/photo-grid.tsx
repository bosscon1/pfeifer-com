import { withBase } from "@/lib/preview-base";

export function PhotoGrid({
  items,
}: {
  items: { src: string; alt: string }[];
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl text-ink">Photos of completed projects</h2>
        <p className="mt-2 text-sm text-muted">
          Representative work in Fayette and Coweta. Ask to see jobs in your neighborhood.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure key={item.src + item.alt} className="overflow-hidden bg-cream">
              <img src={withBase(item.src)} alt={item.alt} className="aspect-16/10 w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
