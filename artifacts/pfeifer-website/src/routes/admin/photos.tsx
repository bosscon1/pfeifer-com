import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  isLivePfeiferHost,
  phpBridgeReady,
  phpDeleteGalleryPhoto,
  phpDeleteGalleryVideo,
  phpListGalleryFolders,
  phpSaveGallerySettings,
  phpUploadGalleryPhotos,
  phpUploadGalleryVideo,
} from "@/lib/php-bridge";
import { LiveSetupNotice } from "@/components/live-setup-notice";
import {
  deleteGalleryPhoto,
  deleteGalleryVideo,
  listGalleryFolders,
  saveGalleryAlbum,
  saveGalleryHero,
  uploadGalleryPhotos,
  uploadGalleryVideo,
  type GalleryFolder,
} from "@/lib/gallery.functions";
import { GALLERY_CATEGORIES, galleryLabel } from "@/lib/gallery";

export const Route = createFileRoute("/admin/photos")({
  head: () => ({
    meta: [
      { title: "Photo galleries | Site admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPhotos,
});

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function isPhpManagedPhoto(name: string): boolean {
  return /^pfeifer-[a-z0-9-]+-[a-f0-9]{20}\.jpg$/i.test(name);
}

function AdminPhotos() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [category, setCategory] = useState("decks");
  const [city, setCity] = useState("");
  const [what, setWhat] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState<"load" | "upload" | "hero" | "video" | null>("load");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [overlay, setOverlay] = useState(55);
  const [liveReady, setLiveReady] = useState(!isLivePfeiferHost());
  const [pendingDelete, setPendingDelete] = useState<{
    category: string;
    name: string;
    thumbUrl: string;
    folder: GalleryFolder;
  } | null>(null);
  const [deletePhase, setDeletePhase] = useState<"confirm" | "working" | null>(null);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [openFolder, setOpenFolder] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("pfeifer-admin-gallery") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (openFolder) sessionStorage.setItem("pfeifer-admin-gallery", openFolder);
      else sessionStorage.removeItem("pfeifer-admin-gallery");
    } catch {
      /* ignore */
    }
  }, [openFolder]);

  useEffect(() => {
    const row = folders.find((f) => f.category === openFolder);
    if (row) setOverlay(row.overlay);
  }, [openFolder, folders]);

  useEffect(() => {
    if (deletePhase !== "working") {
      setDeleteProgress(0);
      return;
    }
    setDeleteProgress(16);
    const id = window.setInterval(() => {
      setDeleteProgress((p) => (p >= 90 ? 90 : p + 8));
    }, 160);
    return () => window.clearInterval(id);
  }, [deletePhase]);

  useEffect(() => {
    if (deletePhase !== "confirm") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPendingDelete(null);
        setDeletePhase(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deletePhase]);

  useEffect(() => {
    if (isPending || !userId) return;
    let live = true;
    const list = isLivePfeiferHost() ? phpListGalleryFolders() : listGalleryFolders();
    void list
      .then((rows) => {
        if (!live) return;
        setFolders(rows);
        setBusy(null);
      })
      .catch((err) => {
        if (!live) return;
        setError(err instanceof Error ? err.message : "Could not list folders.");
        setBusy(null);
      });
    return () => {
      live = false;
    };
  }, [isPending, userId]);

  function showFolder(prev: GalleryFolder[], category: string, featured: string, order: string[]) {
    return prev.map((f) => {
      if (f.category !== category) return f;
      const byName = new Map(f.files.map((file) => [file.name, file]));
      const larges = order.flatMap((name) => {
        const file = byName.get(name);
        return file ? [file] : [];
      });
      const rest = f.files.filter((file) => file.kind !== "large");
      return { ...f, featured, order, files: [...larges, ...rest] };
    });
  }

  async function saveOrder(folder: GalleryFolder, featured: string, order: string[]) {
    if (isLivePfeiferHost() && !liveReady) {
      setError("Admin saves are disabled until SiteGround setup passes Verify setup.");
      return;
    }
    setError("");
    setFolders((prev) => showFolder(prev, folder.category, featured, order));
    try {
      if (isLivePfeiferHost()) {
        await phpSaveGallerySettings({
          category: folder.category,
          featured,
          order,
        });
      } else {
        await saveGalleryAlbum({ data: { category: folder.category, featured, order } });
      }
      setNote(`Cover and order saved for ${galleryLabel(folder.category)}.`);
    } catch (err) {
      try {
        setFolders(await listGalleryFolders());
      } catch {
        /* keep optimistic order if relist fails */
      }
      setError(err instanceof Error ? err.message : "Could not save order.");
    }
  }

  async function saveHero(folder: GalleryFolder, next: number) {
    if (isLivePfeiferHost() && !liveReady) {
      setError("Admin saves are disabled until SiteGround setup passes Verify setup.");
      return;
    }
    const value = Math.max(0, Math.min(80, Math.round(next)));
    setOverlay(value);
    setFolders((prev) => prev.map((f) => (f.category === folder.category ? { ...f, overlay: value } : f)));
    setError("");
    try {
      if (isLivePfeiferHost()) {
        await phpSaveGallerySettings({
          category: folder.category,
          overlay: value,
        });
      } else {
        const row = await saveGalleryHero({ data: { category: folder.category, overlay: value } });
        setFolders((prev) => prev.map((f) => (f.category === row.category ? row : f)));
      }
      setNote(`Hero darkness saved for ${galleryLabel(folder.category)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save hero darkness.");
    }
  }

  async function onHeroVideo(folder: GalleryFolder, list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    if (isLivePfeiferHost() && !liveReady) {
      setError("Admin saves are disabled until SiteGround setup passes Verify setup.");
      return;
    }
    if (file.size > 18 * 1024 * 1024) {
      setError("Keep the hero video under 18 MB.");
      return;
    }
    setBusy("video");
    setError("");
    try {
      const row = isLivePfeiferHost()
        ? await phpUploadGalleryVideo({ category: folder.category, file })
        : await uploadGalleryVideo({ data: { category: folder.category, name: file.name, data: await readAsDataUrl(file) } });
      const nextFolder = "folder" in row ? row.folder : row;
      setFolders((prev) => prev.map((f) => (f.category === nextFolder.category ? nextFolder : f)));
      setNote(`Hero video saved for ${galleryLabel(folder.category)}. Cover stays the poster.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that video.");
    } finally {
      setBusy(null);
    }
  }

  async function removeHeroVideo(folder: GalleryFolder) {
    if (!window.confirm("Remove the hero video from this page? The cover photo stays.")) return;
    if (isLivePfeiferHost() && !liveReady) {
      setError("Admin saves are disabled until SiteGround setup passes Verify setup.");
      return;
    }
    setBusy("video");
    setError("");
    try {
      if (isLivePfeiferHost()) {
        const result = await phpDeleteGalleryVideo({ category: folder.category });
        setFolders((prev) => prev.map((f) => (f.category === result.folder.category ? result.folder : f)));
      } else {
        const row = await deleteGalleryVideo({ data: { category: folder.category } });
        setFolders((prev) => prev.map((f) => (f.category === row.category ? row : f)));
      }
      setNote(`Hero video removed from ${galleryLabel(folder.category)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove that video.");
    } finally {
      setBusy(null);
    }
  }

  async function removePhoto(folder: GalleryFolder, name: string) {
    const largeName = name.endsWith("-thumb.jpg") ? name.replace(/-thumb\.jpg$/i, ".jpg") : name;
    const thumbName = largeName.replace(/\.jpe?g$/i, "-thumb.jpg");
    setError("");
    setDeletePhase("working");
    setFolders((prev) =>
      prev.map((f) => {
        if (f.category !== folder.category) return f;
        const files = f.files.filter((file) => file.name !== largeName && file.name !== thumbName);
        const order = f.order.filter((n) => n !== largeName);
        return {
          ...f,
          files,
          order,
          count: order.length,
          featured: f.featured === largeName ? order[0] ?? null : f.featured,
        };
      }),
    );
    try {
      const result = isLivePfeiferHost()
        ? await phpDeleteGalleryPhoto({ category: folder.category, name: largeName })
        : await deleteGalleryPhoto({ data: { category: folder.category, name: largeName } });
      setFolders((prev) => prev.map((f) => (f.category === result.folder.category ? result.folder : f)));
      setDeleteProgress(100);
      setNote(`Deleted ${largeName} and ${thumbName}.`);
      await new Promise((r) => window.setTimeout(r, 250));
    } catch (err) {
      try {
        setFolders(await (isLivePfeiferHost() ? phpListGalleryFolders() : listGalleryFolders()));
      } catch {
        /* keep optimistic list if relist fails */
      }
      setError(err instanceof Error ? err.message : "Could not delete that photo.");
    } finally {
      setPendingDelete(null);
      setDeletePhase(null);
    }
  }

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Choose one or more photos first.");
      return;
    }
    setBusy("upload");
    setError("");
    setNote("");
    try {
      const result = isLivePfeiferHost()
        ? await phpUploadGalleryPhotos({ category, city, what, files })
        : await uploadGalleryPhotos({
            data: {
              category,
              city,
              what,
              files: await Promise.all(files.map(async (file) => ({ name: file.name, data: await readAsDataUrl(file) }))),
            },
          });
      if (isLivePfeiferHost()) {
        setFolders((prev) => prev.map((f) => result.folders.find((next) => next.category === f.category) ?? f));
      } else {
        setFolders(result.folders);
      }
      const failed = result.results.filter((r) => r.error);
      const ok = result.results.filter((r) => !r.error);
      setNote(
        failed.length
          ? `Saved ${ok.length}. ${failed.length} failed: ${failed.map((f) => f.original).join(", ")}`
          : `Saved ${ok.length} photo${ok.length === 1 ? "" : "s"} into ${result.category}.`,
      );
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell title="Photo galleries">
      <div className="max-w-2xl">
        <LiveSetupNotice onStatus={(row) => setLiveReady(!isLivePfeiferHost() || phpBridgeReady(row))} />
      </div>
      <p className="mt-6 max-w-2xl text-sm text-muted">
        Upload job photos here. Each file becomes a large JPEG (long edge 1600px, watermark) and a
        clean thumb (800px). Files land in{" "}
        <code>public/images/galleries/&#123;folder&#125;/</code> — the same tree you will FTP to
        SiteGround as <code>public_html/images/galleries/</code>. This does not change the live
        WordPress site.
      </p>

      <form className="mt-8 space-y-4 border border-line bg-paper p-5" onSubmit={(e) => void onUpload(e)}>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            Folder
            <select
              className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            City (optional)
            <input
              className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="peachtree-city"
            />
          </label>
          <label className="block text-sm">
            What it is
            <input
              required
              className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="trex-deck"
            />
          </label>
        </div>
        <p className="text-xs text-muted">
          Filename becomes <code>pfeifer-{"{city}-"}{`{what}`}-01.jpg</code>. Leave city blank to
          match the garage style: <code>pfeifer-detached-garage-01.jpg</code>.
        </p>
        <label className="block text-sm">
          Photos
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            className="mt-1 block w-full text-sm"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>
        {files.length ? (
          <p className="text-xs text-muted">{files.length} selected — up to 12 per batch.</p>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {note ? <p className="text-sm text-pfeifer">{note}</p> : null}
        <button
          type="submit"
          disabled={busy !== null}
          className="min-h-12 bg-pfeifer px-5 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark disabled:opacity-60"
        >
          {busy === "upload" ? "Processing…" : "Upload and process"}
        </button>
      </form>

      <h2 className="mt-10 font-display text-2xl">Folders</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {folders.map((folder) => (
          <button
            key={folder.category}
            type="button"
            className="border border-line bg-paper p-4 text-left hover:border-pfeifer"
            onClick={() => setOpenFolder(openFolder === folder.category ? null : folder.category)}
          >
            <p className="font-display text-xl">{galleryLabel(folder.category)}</p>
            <p className="mt-1 text-sm text-muted">
              {folder.count} photo{folder.count === 1 ? "" : "s"}
            </p>
          </button>
        ))}
      </div>

      {folders
        .filter((f) => f.category === openFolder)
        .map((folder) => {
          const larges = folder.files.filter((f) => f.kind === "large");
          return (
          <div key={folder.category} className="mt-6 border border-line bg-paper">
            <p className="border-b border-line bg-cream px-3 py-2 text-sm text-muted">
              Cover photo is the hero on that service page. Darkness is the wash over the cover (and
              video). Use Top, Up, Down, or Bottom — 1, 2, 3 sit across the top, then the rest pack
              down in masonry.
              {note ? <span className="mt-1 block text-pfeifer">{note}</span> : null}
            </p>
            <div className="border-b border-line p-4">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Hero
              </p>
              <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr]">
                <div className="relative min-h-40 overflow-hidden bg-charcoal">
                  {folder.featured ? (
                    <img
                      src={folder.files.find((f) => f.name === folder.featured)?.url ?? ""}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(28, 31, 36, ${overlay / 100})` }}
                  />
                  <p className="relative grid h-40 place-items-center px-3 text-center font-display text-lg text-paper">
                    {galleryLabel(folder.category)}
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm">
                    Hero darkness — {overlay}%
                    <input
                      type="range"
                      min={0}
                      max={80}
                      step={1}
                      value={overlay}
                      className="mt-2 w-full accent-pfeifer"
                      disabled={busy !== null}
                      onChange={(e) => setOverlay(Number(e.target.value))}
                      onPointerUp={(e) => void saveHero(folder, Number((e.target as HTMLInputElement).value))}
                      onKeyUp={(e) => void saveHero(folder, Number((e.target as HTMLInputElement).value))}
                    />
                    <span className="mt-1 block text-xs text-muted">
                      0 is a bright photo. 80 is almost black. Title stays on top.
                    </span>
                  </label>
                  <div>
                    <p className="text-sm">Hero video (optional)</p>
                    <p className="mt-1 text-xs text-muted">
                      MP4, landscape, under 18 MB, no sound. Cover photo is the poster if the video
                      cannot play.
                      {folder.videoName ? (
                        <span className="mt-1 block text-pfeifer">On: {folder.videoName}</span>
                      ) : (
                        <span className="mt-1 block">No video — cover photo only.</span>
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <label className="inline-flex min-h-10 cursor-pointer items-center border border-line px-3 text-xs font-semibold uppercase tracking-wide hover:border-pfeifer">
                        {busy === "video" ? "Saving…" : folder.videoName ? "Replace video" : "Add video"}
                        <input
                          type="file"
                          accept="video/mp4"
                          className="sr-only"
                          disabled={busy !== null}
                          onChange={(e) => {
                            void onHeroVideo(folder, e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {folder.videoName ? (
                        <button
                          type="button"
                          className="min-h-10 px-3 text-xs font-semibold uppercase tracking-wide text-danger hover:underline disabled:opacity-40"
                          disabled={busy !== null}
                          onClick={() => void removeHeroVideo(folder)}
                        >
                          Remove video
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Photo</th>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Cover</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {larges.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-muted" colSpan={5}>
                      Empty — upload the first batch into this folder.
                    </td>
                  </tr>
                ) : (
                  larges.map((file, i) => (
                    <tr key={file.name} className="border-t border-line">
                      <td className="px-3 py-2">
                        <img src={file.url.replace(/\.jpg$/i, "-thumb.jpg")} alt="" className="h-16 w-24 object-cover" />
                      </td>
                      <td className="px-3 py-2">
                        <a href={file.url} className="text-pfeifer" target="_blank" rel="noreferrer">
                          {file.name}
                        </a>
                        {folder.featured === file.name ? (
                          <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-pfeifer">
                            Cover
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="min-h-10 border border-line px-3 text-xs font-semibold uppercase tracking-wide hover:border-pfeifer"
                          onClick={() => void saveOrder(folder, file.name, folder.order)}
                        >
                          Use as cover
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="min-h-10 px-2 text-xs uppercase tracking-wide disabled:opacity-40"
                          disabled={i === 0}
                          onClick={() => {
                            const next = folder.order.filter((n) => n !== file.name);
                            next.unshift(file.name);
                            void saveOrder(folder, folder.featured ?? file.name, next);
                          }}
                        >
                          Top
                        </button>
                        <button
                          type="button"
                          className="min-h-10 px-2 text-xs uppercase tracking-wide disabled:opacity-40"
                          disabled={i === 0}
                          onClick={() => {
                            const next = [...folder.order];
                            const at = next.indexOf(file.name);
                            if (at > 0) {
                              [next[at - 1], next[at]] = [next[at], next[at - 1]];
                              void saveOrder(folder, folder.featured ?? file.name, next);
                            }
                          }}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="min-h-10 px-2 text-xs uppercase tracking-wide disabled:opacity-40"
                          disabled={i === larges.length - 1}
                          onClick={() => {
                            const next = [...folder.order];
                            const at = next.indexOf(file.name);
                            if (at >= 0 && at < next.length - 1) {
                              [next[at + 1], next[at]] = [next[at], next[at + 1]];
                              void saveOrder(folder, folder.featured ?? file.name, next);
                            }
                          }}
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="min-h-10 px-2 text-xs uppercase tracking-wide disabled:opacity-40"
                          disabled={i === larges.length - 1}
                          onClick={() => {
                            const next = folder.order.filter((n) => n !== file.name);
                            next.push(file.name);
                            void saveOrder(folder, folder.featured ?? file.name, next);
                          }}
                        >
                          Bottom
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        {!isLivePfeiferHost() || isPhpManagedPhoto(file.name) ? (
                          <button
                            type="button"
                            className="min-h-10 text-xs font-semibold uppercase tracking-wide text-danger hover:underline disabled:opacity-40"
                            disabled={deletePhase !== null}
                            onClick={() => {
                              setError("");
                              setPendingDelete({
                                category: folder.category,
                                name: file.name,
                                thumbUrl: file.url.replace(/\.jpe?g$/i, "-thumb.jpg"),
                                folder,
                              });
                              setDeletePhase("confirm");
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-muted">Seed asset</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
          );
        })}

      <p className="mt-8 text-sm">
        <Link to="/admin/" className="text-pfeifer">
          Back to dashboard
        </Link>
      </p>

      {pendingDelete && deletePhase ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-photo-title"
          aria-busy={deletePhase === "working"}
        >
          <div className="w-full max-w-md border border-line bg-paper p-6 shadow-lg">
            {deletePhase === "confirm" ? (
              <>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Confirm delete
                </p>
                <h2 id="delete-photo-title" className="mt-2 font-display text-2xl text-ink">
                  Delete this photo and its thumbnail?
                </h2>
                <img
                  src={pendingDelete.thumbUrl}
                  alt=""
                  className="mt-4 h-32 w-full object-cover"
                />
                <p className="mt-3 break-all text-sm text-ink">{pendingDelete.name}</p>
                <p className="mt-1 text-sm text-muted">
                  This removes the large JPEG and the matching <code>-thumb.jpg</code>. It cannot be
                  undone from this screen.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="min-h-12 bg-danger px-5 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:opacity-90"
                    onClick={() => void removePhoto(pendingDelete.folder, pendingDelete.name)}
                  >
                    Delete photo + thumb
                  </button>
                  <button
                    type="button"
                    className="min-h-12 border border-line px-5 font-sans text-sm font-bold uppercase tracking-wide hover:border-pfeifer"
                    onClick={() => {
                      setPendingDelete(null);
                      setDeletePhase(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="delete-photo-title" className="font-display text-2xl text-ink">
                  Deleting photo and thumbnail
                </h2>
                <p className="mt-2 text-sm text-muted">{pendingDelete.name}</p>
                <div className="mt-6 h-3 w-full overflow-hidden bg-cream">
                  <div
                    className="h-full bg-pfeifer motion-safe:transition-[width] motion-safe:duration-200"
                    style={{ width: `${deleteProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {deleteProgress}% — please wait
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
