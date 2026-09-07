import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GALLERY_CATEGORIES, galleryLabel } from "@/lib/gallery";
import {
  deleteGalleryPhoto,
  listGalleryFolders,
  saveGalleryAlbum,
  uploadGalleryPhotos,
  type GalleryFolder,
} from "@/lib/gallery.functions";

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

function AdminPhotos() {
  const { user, isPending } = useCurrentUserState();
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [category, setCategory] = useState("decks");
  const [city, setCity] = useState("");
  const [what, setWhat] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState<"load" | "upload" | null>("load");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    void listGalleryFolders()
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
  }, [isPending, user]);

  async function saveOrder(folder: GalleryFolder, featured: string, order: string[]) {
    setError("");
    try {
      await saveGalleryAlbum({ data: { category: folder.category, featured, order } });
      const rows = await listGalleryFolders();
      setFolders(rows);
      setNote(`Cover and order saved for ${galleryLabel(folder.category)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save order.");
    }
  }

  async function removePhoto(folder: GalleryFolder, name: string) {
    if (!window.confirm(`Delete ${name} and its thumb from this gallery?`)) return;
    setError("");
    try {
      const result = await deleteGalleryPhoto({ data: { category: folder.category, name } });
      setFolders(result.folders);
      setNote(`Deleted ${name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that photo.");
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
      const payload = [];
      for (const file of files) {
        payload.push({ name: file.name, data: await readAsDataUrl(file) });
      }
      const result = await uploadGalleryPhotos({
        data: { category, city, what, files: payload },
      });
      setFolders(result.folders);
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
      <p className="max-w-2xl text-sm text-muted">
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
              Cover photo is the hero on that service page. Use Move up / down to set the masonry
              order, then Save order.
            </p>
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
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="min-h-10 text-xs font-semibold uppercase tracking-wide text-danger hover:underline"
                          onClick={() => void removePhoto(folder, file.name)}
                        >
                          Delete
                        </button>
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
    </AdminShell>
  );
}
