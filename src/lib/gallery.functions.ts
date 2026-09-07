import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { assertStaffUser } from "@/lib/assert-staff";
import {
  GALLERY_SLUGS,
  galleryStem,
  isGalleryCategory,
  slugPart,
  type GalleryCategory,
} from "@/lib/gallery";

const IMAGES = join(process.cwd(), "public/images");
const GALLERIES = join(IMAGES, "galleries");
const SCRIPT = join(process.cwd(), "scripts/process-gallery-photo.py");

export type GalleryFile = {
  name: string;
  url: string;
  bytes: number;
  kind: "large" | "thumb" | "other";
};

export type GalleryFolder = {
  category: GalleryCategory;
  count: number;
  files: GalleryFile[];
  featured: string | null;
  order: string[];
  publicPath: string;
};

export type GalleryAlbum = {
  category: string;
  featured: string | null;
  featuredUrl: string | null;
  photos: { src: string; fullSrc: string; alt: string; name: string }[];
};

type Manifest = { featured?: string; order?: string[] };

async function dirHasPhotos(dir: string): Promise<boolean> {
  try {
    const names = await readdir(dir);
    return names.some((n) => n.endsWith(".jpg") && !n.endsWith("-thumb.jpg") && !n.startsWith("."));
  } catch {
    return false;
  }
}

async function resolveStore(category: string): Promise<{ dir: string; urlBase: string }> {
  const direct = { dir: join(IMAGES, category), urlBase: `/images/${category}` };
  const nested = { dir: join(GALLERIES, category), urlBase: `/images/galleries/${category}` };
  if (await dirHasPhotos(direct.dir)) return direct;
  if (await dirHasPhotos(nested.dir)) return nested;
  return nested;
}

async function ensureFolders() {
  for (const cat of GALLERY_SLUGS) {
    await mkdir(join(GALLERIES, cat), { recursive: true });
  }
}

function kindOf(name: string): GalleryFile["kind"] {
  if (name.endsWith("-thumb.jpg")) return "thumb";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "large";
  return "other";
}

async function readManifest(dir: string): Promise<Manifest> {
  try {
    const raw = JSON.parse(await readFile(join(dir, "gallery.json"), "utf8")) as Manifest;
    return {
      featured: typeof raw.featured === "string" ? raw.featured : undefined,
      order: Array.isArray(raw.order) ? raw.order.filter((n) => typeof n === "string") : undefined,
    };
  } catch {
    return {};
  }
}

function sortLarges(names: string[], order?: string[]): string[] {
  const larges = names.filter((n) => kindOf(n) === "large").sort();
  if (!order?.length) return larges;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of order) {
    if (larges.includes(name) && !seen.has(name)) {
      out.push(name);
      seen.add(name);
    }
  }
  for (const name of larges) {
    if (!seen.has(name)) out.push(name);
  }
  return out;
}

async function readFolder(category: GalleryCategory): Promise<GalleryFolder> {
  const store = await resolveStore(category);
  await mkdir(store.dir, { recursive: true });
  const names = (await readdir(store.dir)).filter((n) => !n.startsWith(".") && n !== "gallery.json");
  const manifest = await readManifest(store.dir);
  const ordered = sortLarges(names, manifest.order);
  const files: GalleryFile[] = [];
  for (const name of [...ordered, ...names.filter((n) => kindOf(n) !== "large").sort()]) {
    if (files.some((f) => f.name === name)) continue;
    const info = await stat(join(store.dir, name));
    if (!info.isFile()) continue;
    files.push({
      name,
      url: `${store.urlBase}/${name}`,
      bytes: info.size,
      kind: kindOf(name),
    });
  }
  const featured = manifest.featured && ordered.includes(manifest.featured) ? manifest.featured : ordered[0] ?? null;
  return {
    category,
    count: ordered.length,
    files,
    featured,
    order: ordered,
    publicPath: store.urlBase,
  };
}

function nextNumber(existing: string[], city: string, what: string): number {
  const prefix = galleryStem(city, what, 1).replace(/-01$/, "-");
  let max = 0;
  for (const name of existing) {
    if (!name.startsWith(prefix) || name.includes("-thumb.")) continue;
    const m = name.match(/-(\d+)\.jpe?g$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function decodeImage(raw: string): Buffer {
  const trimmed = raw.trim();
  const comma = trimmed.indexOf(",");
  const payload = trimmed.startsWith("data:") && comma >= 0 ? trimmed.slice(comma + 1) : trimmed;
  return Buffer.from(payload, "base64");
}

function runProcessor(src: string, large: string, thumb: string): Promise<{
  ok: boolean;
  error?: string;
  large?: { bytes: number; width: number; height: number };
  thumb?: { bytes: number; width: number; height: number };
}> {
  return new Promise((resolve) => {
    const child = spawn("python3", [SCRIPT, src, large, thumb], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (c) => {
      out += String(c);
    });
    child.stderr.on("data", (c) => {
      err += String(c);
    });
    child.on("close", () => {
      try {
        resolve(JSON.parse(out));
      } catch {
        resolve({ ok: false, error: err || out || "Processor failed." });
      }
    });
  });
}

function toAlbum(folder: GalleryFolder): GalleryAlbum {
  const larges = folder.order;
  const photos = larges.map((name) => {
    const thumb = name.replace(/\.jpe?g$/i, "-thumb.jpg");
    const thumbFile = folder.files.find((f) => f.name === thumb);
    const largeFile = folder.files.find((f) => f.name === name);
    return {
      name,
      src: thumbFile?.url ?? largeFile?.url ?? "",
      fullSrc: largeFile?.url ?? "",
      alt: name.replace(/\.jpe?g$/i, "").replace(/-/g, " "),
    };
  });
  const featured = folder.featured;
  const featuredFile = folder.files.find((f) => f.name === featured);
  return {
    category: folder.category,
    featured,
    featuredUrl: featuredFile?.url ?? photos[0]?.fullSrc ?? null,
    photos,
  };
}

export const listGalleryFolders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    await ensureFolders();
    const folders: GalleryFolder[] = [];
    for (const category of GALLERY_SLUGS) {
      folders.push(await readFolder(category));
    }
    return folders;
  });

export const loadGalleryAlbum = createServerFn({ method: "GET" })
  .validator(z.object({ category: z.string() }))
  .handler(async ({ data }) => {
    if (!isGalleryCategory(data.category)) throw new Error("Unknown gallery.");
    return toAlbum(await readFolder(data.category));
  });

export const saveGalleryAlbum = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      featured: z.string().min(1),
      order: z.array(z.string()).min(1),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    const allowed = new Set(folder.files.filter((f) => f.kind === "large").map((f) => f.name));
    const order = data.order.filter((name) => allowed.has(name));
    const featured = allowed.has(data.featured) ? data.featured : order[0];
    if (!featured) throw new Error("No photos in that folder yet.");
    await writeFile(join(store.dir, "gallery.json"), `${JSON.stringify({ featured, order }, null, 2)}\n`);
    return toAlbum(await readFolder(data.category));
  });

export const deleteGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      name: z.string().min(1).max(180),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    if (data.name.includes("/") || data.name.includes("\\") || data.name.startsWith(".")) {
      throw new Error("Invalid file name.");
    }
    if (!data.name.endsWith(".jpg") && !data.name.endsWith(".jpeg")) {
      throw new Error("Only gallery JPEGs can be deleted here.");
    }
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    const allowed = new Set(folder.files.map((f) => f.name));
    const largeName = data.name.endsWith("-thumb.jpg")
      ? data.name.replace(/-thumb\.jpg$/i, ".jpg")
      : data.name;
    if (!allowed.has(largeName) && !allowed.has(data.name)) {
      throw new Error("That photo is not in this folder.");
    }
    const thumbName = largeName.replace(/\.jpe?g$/i, "-thumb.jpg");
    for (const name of [largeName, thumbName]) {
      try {
        await unlink(join(store.dir, name));
      } catch {
        // already gone
      }
    }
    const order = folder.order.filter((n) => n !== largeName);
    const featured = folder.featured === largeName ? order[0] ?? null : folder.featured;
    await writeFile(
      join(store.dir, "gallery.json"),
      `${JSON.stringify({ featured, order }, null, 2)}\n`,
    );
    return { folders: await Promise.all(GALLERY_SLUGS.map((c) => readFolder(c))), deleted: largeName };
  });

export const uploadGalleryPhotos = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      category: z.string(),
      city: z.string().max(40).optional().default(""),
      what: z.string().min(2).max(48),
      files: z
        .array(
          z.object({
            name: z.string().min(1).max(180),
            data: z.string().min(32),
          }),
        )
        .min(1)
        .max(12),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    if (!isGalleryCategory(data.category)) throw new Error("Pick a gallery folder.");
    const what = slugPart(data.what);
    if (!what) throw new Error("Describe what the photos show.");
    const city = slugPart(data.city ?? "");
    await ensureFolders();
    const store = await resolveStore(data.category);
    const folder = await readFolder(data.category);
    let n = nextNumber(folder.files.map((f) => f.name), city, what);
    const results: {
      original: string;
      stem: string;
      largeUrl: string;
      thumbUrl: string;
      largeKb: number;
      thumbKb: number;
      error?: string;
    }[] = [];

    for (const file of data.files) {
      const stem = galleryStem(city, what, n);
      n += 1;
      const tmp = join(tmpdir(), `pfeifer-${Date.now()}-${n}-${file.name.replace(/[^\w.-]+/g, "")}`);
      const largePath = join(store.dir, `${stem}.jpg`);
      const thumbPath = join(store.dir, `${stem}-thumb.jpg`);
      try {
        await writeFile(tmp, decodeImage(file.data));
        const processed = await runProcessor(tmp, largePath, thumbPath);
        if (!processed.ok) {
          results.push({
            original: file.name,
            stem,
            largeUrl: "",
            thumbUrl: "",
            largeKb: 0,
            thumbKb: 0,
            error: processed.error || "Could not process that photo.",
          });
          continue;
        }
        results.push({
          original: file.name,
          stem,
          largeUrl: `${store.urlBase}/${stem}.jpg`,
          thumbUrl: `${store.urlBase}/${stem}-thumb.jpg`,
          largeKb: Math.round((processed.large?.bytes ?? 0) / 1024),
          thumbKb: Math.round((processed.thumb?.bytes ?? 0) / 1024),
        });
      } catch (err) {
        results.push({
          original: file.name,
          stem,
          largeUrl: "",
          thumbUrl: "",
          largeKb: 0,
          thumbKb: 0,
          error: err instanceof Error ? err.message : "Upload failed.",
        });
      }
    }

    return {
      category: data.category,
      folders: await Promise.all(GALLERY_SLUGS.map((c) => readFolder(c))),
      results,
    };
  });
