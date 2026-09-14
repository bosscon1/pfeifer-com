export type PhpBridgeUser = { email: string; name: string };

export type PhpBridgeStatus = {
  ok: boolean;
  php?: boolean;
  config_file?: boolean;
  password_set?: boolean;
  mysql?: boolean;
  mysql_error?: string | null;
  table?: boolean;
  google?: boolean;
  ready?: boolean;
  user?: PhpBridgeUser | null;
  error?: string;
};

export function isLivePfeiferHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.replace(/^www\./i, "").toLowerCase();
  return host === "pfeiferbuild.com";
}

export function phpBridgeReady(status: PhpBridgeStatus | null | undefined): boolean {
  return Boolean(status?.php && status.ready);
}

export async function phpBridgeStatus(): Promise<PhpBridgeStatus | null> {
  try {
    const res = await fetch("/api/bridge/status.php", { credentials: "include", cache: "no-store" });
    const text = await res.text();
    if (!text.trim().startsWith("{")) {
      return { ok: false, php: false, error: "PHP did not run. Confirm api/bridge/*.php is in the SiteGround web root and .php files execute." };
    }
    return JSON.parse(text) as PhpBridgeStatus;
  } catch {
    return { ok: false, php: false, error: "Could not reach /api/bridge/status.php." };
  }
}

export async function phpBridgeSession(): Promise<PhpBridgeUser | null> {
  try {
    const res = await fetch("/api/bridge/session.php", { credentials: "include" });
    const text = await res.text();
    if (!res.ok || !text.trim().startsWith("{")) return null;
    const body = JSON.parse(text) as { user?: PhpBridgeUser | null };
    return body.user ?? null;
  } catch {
    return null;
  }
}

export async function phpSaveGallerySettings(data: {
  category: string;
  featured?: string | null;
  order?: string[];
  overlay?: number;
  video?: string | null;
}): Promise<void> {
  const res = await fetch("/api/bridge/gallery-settings.php", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    throw new Error("PHP bridge did not respond.");
  }
  if (!res.ok || !body.ok) throw new Error(body.error || "Could not save to MySQL.");
}
