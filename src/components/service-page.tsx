import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { PhotoGrid } from "@/components/photo-grid";
import { SixReasons } from "@/components/six-reasons";

export function ServicePage({
  image,
  video,
  eyebrow,
  title,
  lede,
  sections,
  photos,
}: {
  image: string;
  video?: string;
  eyebrow?: string;
  title: string;
  lede: string;
  sections: { heading: string; body: string }[];
  photos: { src: string; alt: string }[];
}) {
  return (
    <main>
      <PageHero image={image} video={video} alt={title} eyebrow={eyebrow} title={title} lede={lede} />
      <article className="mx-auto max-w-3xl px-4 py-14">
        {sections.map((s) => (
          <section key={s.heading} className="mb-10">
            <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
      </article>
      <PhotoGrid items={photos} />
      <SixReasons />
      <CtaBand />
    </main>
  );
}
