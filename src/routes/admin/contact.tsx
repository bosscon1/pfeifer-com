import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAdminSiteContact, saveAdminSiteContact } from "@/lib/site-contact.functions";
import { defaultSiteContact, type SiteContact } from "@/lib/site-contact";

export const Route = createFileRoute("/admin/contact")({
  head: () => ({
    meta: [
      { title: "Office contact | Site admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContact,
});

function AdminContact() {
  const { user, isPending } = useCurrentUserState();
  const [form, setForm] = useState(defaultSiteContact);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "err">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    void getAdminSiteContact()
      .then((row) => {
        if (!live) return;
        setForm(row);
        setStatus("ready");
      })
      .catch(() => {
        if (!live) return;
        setStatus("err");
        setMessage("Sign in again to edit office details.");
      });
    return () => {
      live = false;
    };
  }, [isPending, user]);

  function setField<K extends keyof SiteContact>(key: K, value: SiteContact[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("ready");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const saved = await saveAdminSiteContact({
        data: {
          phone: form.phone,
          email: form.email,
          addressLine: form.addressLine,
          cityLine: form.cityLine,
          hours: form.hours,
          serviceArea: form.serviceArea,
        },
      });
      setForm(saved);
      setStatus("saved");
      setMessage("Saved. Header, footer, and contact pages will show the new numbers.");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <AdminShell title="Contact and office">
      <p className="max-w-2xl text-sm text-muted">
        These fields print in the header bar, footer, contact page, and call buttons. This preview
        stores the change here. The live WordPress site does not change until cutover.
      </p>
      <form className="mt-8 max-w-xl space-y-4" onSubmit={(e) => void onSubmit(e)}>
        <Field label="Phone" value={form.phone} onChange={(v) => setField("phone", v)} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setField("email", v)} />
        <Field
          label="Street address"
          value={form.addressLine}
          onChange={(v) => setField("addressLine", v)}
        />
        <Field
          label="City, state, ZIP"
          value={form.cityLine}
          onChange={(v) => setField("cityLine", v)}
        />
        <Field label="Hours" value={form.hours} onChange={(v) => setField("hours", v)} />
        <label className="block text-sm font-medium">
          Service area sentence
          <textarea
            className="mt-1 min-h-24 w-full border border-line bg-paper px-3 py-2"
            value={form.serviceArea}
            onChange={(e) => setField("serviceArea", e.target.value)}
            required
          />
        </label>
        {form.updatedAt ? (
          <p className="text-xs text-muted">Last saved {form.updatedAt.replace("T", " ").slice(0, 19)}</p>
        ) : (
          <p className="text-xs text-muted">Using the printed office defaults until you save.</p>
        )}
        {message ? (
          <p className={`text-sm ${status === "err" ? "text-danger" : "text-pfeifer"}`}>{message}</p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === "loading" || status === "saving"}
            className="min-h-12 bg-pfeifer px-6 font-sans text-sm font-bold uppercase tracking-wide text-paper hover:bg-pfeifer-dark disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save office details"}
          </button>
          <Link to="/admin/" className="inline-flex min-h-12 items-center text-sm text-pfeifer">
            Back to dashboard
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type={type}
        required
        className="mt-1 w-full min-h-11 border border-line bg-paper px-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
