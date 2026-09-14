import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=Manrope:wght@400;500;600;700&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap";

const SAMPLE_H1 = "Transform your space with Pfeifer.";
const SAMPLE_BODY =
  "Pfeifer Building Company has served the Fayette and Coweta County area for almost 30 years. In that time we have installed thousands of decks, kitchens, bathrooms, detached garages, home additions, and more.";
const PANGRAM = "The quick brown fox jumps over the lazy dog.";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ  abcdefghijklmnopqrstuvwxyz  1234567890";

type FontSpec = {
  rank: number;
  name: string;
  family: string;
  kind: "Sans" | "Serif";
  role: string;
  designer: string;
  why: string;
  pairs: string;
  weights: number[];
  italic?: boolean;
  inUse?: "display" | "body";
  tracking: string;
};

const FONTS: FontSpec[] = [
  {
    rank: 1,
    name: "Inter",
    family: "Inter",
    kind: "Sans",
    role: "UI and body",
    designer: "Rasmus Andersson",
    why: "The default interface face of the 2020s. Huge x-height, variable axes, used on GitHub, Figma-adjacent products, and most SaaS.",
    pairs: "Newsreader, Source Serif 4, Instrument Serif",
    weights: [400, 500, 600, 700],
    tracking: "-0.03em",
  },
  {
    rank: 2,
    name: "Roboto",
    family: "Roboto",
    kind: "Sans",
    role: "UI and body",
    designer: "Christian Robertson / Google",
    why: "Still the most-downloaded Google Font. Android and Material Design. Neutral, slightly condensed, works at every size.",
    pairs: "Roboto Slab, Playfair Display, Source Serif 4",
    weights: [400, 500, 700],
    tracking: "-0.02em",
  },
  {
    rank: 3,
    name: "Open Sans",
    family: "Open Sans",
    kind: "Sans",
    role: "Body",
    designer: "Steve Matteson",
    why: "A humanist workhorse. Still one of the most served webfonts in the world — friendly, wide, and readable in long copy.",
    pairs: "Montserrat, Playfair Display, Outfit",
    weights: [400, 600, 700],
    tracking: "-0.02em",
  },
  {
    rank: 4,
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
    kind: "Sans",
    role: "Headlines and UI",
    designer: "Gumpita Rahayu / Tokotype",
    why: "The 2024–26 replacement for Poppins on brand and marketing sites. Geometric, but with more character in the details.",
    pairs: "Instrument Serif, Newsreader, Inter",
    weights: [400, 500, 600, 700],
    tracking: "-0.03em",
  },
  {
    rank: 5,
    name: "DM Sans",
    family: "DM Sans",
    kind: "Sans",
    role: "Body and UI",
    designer: "Colophon Foundry",
    why: "Low-contrast geometric sans. Common on agency and product sites. Clean at small sizes without going sterile.",
    pairs: "DM Serif Display, Outfit, Instrument Serif",
    weights: [400, 500, 700],
    inUse: "body",
    tracking: "-0.02em",
  },
  {
    rank: 6,
    name: "Outfit",
    family: "Outfit",
    kind: "Sans",
    role: "Headlines",
    designer: "Rodrigo Fuenzalida",
    why: "Geometric display-and-UI family. Confident at large sizes, still readable in nav. Current headline face on this site.",
    pairs: "DM Sans, Inter, Instrument Serif",
    weights: [400, 500, 600, 700],
    inUse: "display",
    tracking: "-0.03em",
  },
  {
    rank: 7,
    name: "Poppins",
    family: "Poppins",
    kind: "Sans",
    role: "Headlines and marketing",
    designer: "Indian Type Foundry",
    why: "Geometric, round, extremely popular on landing pages. Easy to overuse — strong for CTAs and short headlines.",
    pairs: "Open Sans, Lora, Source Serif 4",
    weights: [400, 500, 600, 700],
    tracking: "-0.02em",
  },
  {
    rank: 8,
    name: "Manrope",
    family: "Manrope",
    kind: "Sans",
    role: "UI and body",
    designer: "Mikhail Sharanda",
    why: "Modern grotesque with a large x-height. Frequent on dashboards, fintech, and professional service sites.",
    pairs: "Fraunces, Playfair Display, Instrument Serif",
    weights: [400, 500, 600, 700],
    tracking: "-0.025em",
  },
  {
    rank: 9,
    name: "Space Grotesk",
    family: "Space Grotesk",
    kind: "Sans",
    role: "Headlines",
    designer: "Florian Karsten",
    why: "Proportional companion to Space Mono. Slightly technical and architectural — distinctive without becoming a costume.",
    pairs: "Inter, Source Serif 4, Instrument Serif",
    weights: [400, 500, 600, 700],
    tracking: "-0.03em",
  },
  {
    rank: 10,
    name: "Instrument Serif",
    family: "Instrument Serif",
    kind: "Serif",
    role: "Headlines",
    designer: "Rodrigo Fuenzalida / Instrument",
    why: "The editorial display serif of 2025–26. Soft contrast, contemporary, pairs cleanly with geometric sans faces.",
    pairs: "Instrument Sans, Inter, Outfit, DM Sans",
    weights: [400],
    italic: true,
    tracking: "0",
  },
];

const WEIGHT_LABEL: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
};

export const Route = createFileRoute("/internal/fonts/")({
  head: () => ({
    meta: [
      { title: "Type reference · internal" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      {
        name: "description",
        content: "Internal type specimen — not for public indexing.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      { rel: "stylesheet", href: FONT_CSS },
    ],
  }),
  component: FontLab,
});

function FontLab() {
  const [display, setDisplay] = useState("Outfit");
  const [body, setBody] = useState("DM Sans");
  const displayFont = FONTS.find((f) => f.family === display) ?? FONTS[5];
  const bodyFont = FONTS.find((f) => f.family === body) ?? FONTS[4];

  return (
    <main className="min-h-dvh bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-pfeifer">
              Internal · not indexed
            </p>
            <p className="font-sans text-sm font-semibold text-ink">Type reference</p>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center font-sans text-xs font-bold uppercase tracking-wide text-pfeifer no-underline"
          >
            Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Ten fonts you actually see on the web right now
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Ranked by a mix of live usage and what studios are specifying in 2025–26. Workhorses
          (Inter, Roboto, Open Sans, Poppins) plus current defaults (Plus Jakarta Sans, DM Sans,
          Outfit, Manrope, Space Grotesk, Instrument Serif). This page is for choosing type — the
          live site stays Outfit + DM Sans until you say otherwise.
        </p>

        <section className="mt-8 border border-line bg-paper p-6">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-pfeifer">
            Pairing preview · Pfeifer copy
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex min-w-44 flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Headline
              <select
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                className="min-h-11 border border-line bg-paper px-3 font-sans text-sm font-medium normal-case tracking-normal text-ink"
              >
                {FONTS.map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.name}
                    {f.inUse === "display" ? " · current" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-44 flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Body
              <select
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-11 border border-line bg-paper px-3 font-sans text-sm font-medium normal-case tracking-normal text-ink"
              >
                {FONTS.map((f) => (
                  <option key={`body-${f.family}`} value={f.family}>
                    {f.name}
                    {f.inUse === "body" ? " · current" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pfeifer">
              Fayette & Coweta Counties · Since 1997
            </p>
            <p
              className="mt-2 text-3xl leading-tight text-ink md:text-5xl"
              style={{
                fontFamily: `"${displayFont.family}", sans-serif`,
                letterSpacing: displayFont.tracking,
              }}
            >
              {SAMPLE_H1}
            </p>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
              style={{ fontFamily: `"${bodyFont.family}", sans-serif` }}
            >
              {SAMPLE_BODY}
            </p>
          </div>
        </section>

        <ol className="mt-10 space-y-6">
          {FONTS.map((font) => (
            <li key={font.family} className="border border-line bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted">
                    {String(font.rank).padStart(2, "0")} · {font.kind} · {font.role}
                  </p>
                  <h2
                    className="mt-1 text-4xl leading-none text-ink md:text-5xl"
                    style={{
                      fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                      letterSpacing: font.tracking,
                      fontWeight: 500,
                    }}
                  >
                    {font.name}
                  </h2>
                </div>
                {font.inUse ? (
                  <span className="bg-pfeifer px-2 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-wide text-paper">
                    On this site · {font.inUse}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{font.why}</p>
              <p
                className="mt-6 text-3xl leading-tight text-ink md:text-4xl"
                style={{
                  fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                  letterSpacing: font.tracking,
                }}
              >
                {SAMPLE_H1}
              </p>
              <p
                className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80"
                style={{
                  fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                }}
              >
                {SAMPLE_BODY}
              </p>
              <p
                className="mt-4 text-sm text-muted"
                style={{
                  fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                }}
              >
                {PANGRAM}
              </p>
              <p
                className="mt-2 text-sm tracking-wide text-ink"
                style={{
                  fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                }}
              >
                {CHARS}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
                {font.weights.map((w) => (
                  <span
                    key={w}
                    className="text-lg text-ink"
                    style={{
                      fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                      fontWeight: w,
                    }}
                  >
                    {WEIGHT_LABEL[w] ?? w}
                  </span>
                ))}
                {font.italic ? (
                  <span
                    className="text-lg text-ink italic"
                    style={{
                      fontFamily: `"${font.family}", ${font.kind === "Serif" ? "serif" : "sans-serif"}`,
                    }}
                  >
                    Italic
                  </span>
                ) : null}
              </div>
              <p className="mt-3 font-sans text-xs text-muted">
                {font.designer}
                {" · "}
                Pairs with {font.pairs}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
