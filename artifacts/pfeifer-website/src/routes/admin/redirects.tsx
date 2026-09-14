import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addManualRedirect,
  compareUrlRedirects,
  listUrlRedirects,
  publishUrlRedirects,
  updateUrlRedirect,
  type RedirectRow,
} from "@/lib/url-redirects.functions";

export const Route = createFileRoute("/admin/redirects")({
  head: () => ({
    meta: [
      { title: "URL redirects | Site admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRedirects,
});

function AdminRedirects() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<RedirectRow[]>([]);
  const [livePaths, setLivePaths] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"load" | "scan" | "save" | "publish" | null>("load");
  const [manual, setManual] = useState("");
  const [filter, setFilter] = useState<"open" | "published" | "ignored" | "all">("open");

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    void listUrlRedirects()
      .then((data) => {
        if (!live) return;
        setRows(data.rows);
        setLivePaths(data.livePaths);
        setBusy(null);
      })
      .catch((err) => {
        if (!live) return;
        setError(err instanceof Error ? err.message : "Could not load redirects.");
        setBusy(null);
      });
    return () => {
      live = false;
    };
  }, [isPending, user]);

  const counts = useMemo(() => {
    return {
      detected: rows.filter((r) => r.status === "detected").length,
      ready: rows.filter((r) => r.status === "ready").length,
      published: rows.filter((r) => r.status === "published").length,
      ignored: rows.filter((r) => r.status === "ignored").length,
    };
  }, [rows]);

  const visible = rows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "open") return r.status === "detected" || r.status === "ready";
    return r.status === filter;
  });

  async function scan() {
    setBusy("scan");
    setError("");
    try {
      const result = await compareUrlRedirects();
      setRows(result.rows);
      setNote(result.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compare failed.");
    } finally {
      setBusy(null);
    }
  }

  async function addManual() {
    setBusy("save");
    setError("");
    try {
      const next = await addManualRedirect({ data: { path: manual } });
      setRows(next);
      setManual("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that path.");
    } finally {
      setBusy(null);
    }
  }

  async function setTarget(row: RedirectRow, toPath: string) {
    setBusy("save");
    setError("");
    try {
      const next = await updateUrlRedirect({
        data: { id: row.id, toPath: toPath || null, status: toPath ? "ready" : "detected" },
      });
      setRows(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that destination.");
    } finally {
      setBusy(null);
    }
  }

  async function setStatus(row: RedirectRow, status: RedirectRow["status"]) {
    setBusy("save");
    setError("");
    try {
      const next = await updateUrlRedirect({
        data: { id: row.id, toPath: row.toPath, status },
      });
      setRows(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update that row.");
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    setBusy("publish");
    setError("");
    try {
      const result = await publishUrlRedirects();
      setRows(result.rows);
      setNote(result.fileNote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell title="404s and redirects">
      <p className="max-w-2xl text-sm text-muted">
        Compare this rebuild to known WordPress leftovers, add a path by hand, pick a live page,
        then publish a 301. Do not send unknown URLs to the homepage unless that is the real
        replacement. WordPress on the live domain is unchanged until cutover.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void scan()}
          className="min-h-11 bg-pfeifer px-4 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark disabled:opacity-60"
        >
          {busy === "scan" ? "Comparing…" : "Compare to WordPress leftovers"}
        </button>
        <button
          type="button"
          disabled={busy !== null || counts.ready === 0}
          onClick={() => void publish()}
          className="min-h-11 border border-pfeifer px-4 font-sans text-sm font-bold uppercase tracking-wide text-pfeifer disabled:opacity-60"
        >
          {busy === "publish" ? "Publishing…" : `Publish ready 301s (${counts.ready})`}
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Need a destination" value={counts.detected} />
        <Stat label="Ready to publish" value={counts.ready} />
        <Stat label="Published 301s" value={counts.published} />
        <Stat label="Ignored" value={counts.ignored} />
      </dl>

      {note ? <p className="mt-4 text-sm text-pfeifer">{note}</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void addManual();
        }}
      >
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="/old-wordpress-path/"
          className="min-h-11 flex-1 border border-line bg-paper px-3"
        />
        <button
          type="submit"
          disabled={busy !== null || !manual.trim()}
          className="min-h-11 border border-line px-4 text-sm font-semibold disabled:opacity-60"
        >
          Add path
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["open", "Open"],
            ["published", "Published"],
            ["ignored", "Ignored"],
            ["all", "All"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`min-h-10 px-3 text-sm ${
              filter === id ? "bg-pfeifer text-paper" : "border border-line bg-paper"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-semibold">Missing path</th>
              <th className="px-3 py-2 font-semibold">Send visitors to</th>
              <th className="px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-muted">
                  {busy === "load"
                    ? "Loading…"
                    : "Nothing in this list yet. Run the compare or add a path."}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id} className="border-t border-line align-top">
                  <td className="px-3 py-3">
                    <code className="text-ink">{row.fromPath}</code>
                    <p className="mt-1 text-xs text-muted">{row.note}</p>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className="w-full min-h-11 border border-line bg-paper px-2"
                      value={row.toPath ?? ""}
                      onChange={(e) => void setTarget(row, e.target.value)}
                      disabled={row.status === "published" || busy !== null}
                    >
                      <option value="">Pick a live page</option>
                      {row.suggestedTo ? (
                        <option value={row.suggestedTo}>Suggested: {row.suggestedTo}</option>
                      ) : null}
                      {livePaths.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <p className="capitalize">{row.status}</p>
                    {row.status !== "published" && row.status !== "ignored" ? (
                      <button
                        type="button"
                        className="mt-2 text-xs text-muted underline"
                        onClick={() => void setStatus(row, "ignored")}
                      >
                        Ignore
                      </button>
                    ) : null}
                    {row.status === "ignored" ? (
                      <button
                        type="button"
                        className="mt-2 text-xs text-pfeifer underline"
                        onClick={() => void setStatus(row, "detected")}
                      >
                        Restore
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm">
        <Link to="/admin/" className="text-pfeifer">
          Back to dashboard
        </Link>
      </p>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-paper px-3 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl">{value}</dd>
    </div>
  );
}
