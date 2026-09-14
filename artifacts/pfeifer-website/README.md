# Pfeifer Building Company website

Local replacement build for the public WordPress site at [pfeiferbuild.com](https://pfeiferbuild.com). Same brand, same service area, same URL paths so Google does not drop the current pages. No WordPress, no CMS login, no plugins.

> **Do not touch production:** this repository must not be deployed to, configured for, or used to write to `pfeiferbuild.com` until explicit go-live authorization. All CMS/API work below is for a separately authorized staging origin. Development defaults never infer or write to the live WordPress site.

Office: 1415 Senoia Road, Suite B, Tyrone, GA 30290 · 770-487-1380 · office@pfeiferbuild.com

## What this is

A brochure site a homeowner in Fayette or Coweta County can use to call, email, or request a bid. Pages live at the old WordPress permalinks (`/decks-by-pfeifer/`, `/peachtree-city-ga/`, `/finished-basement/`, and the rest). See `REDIRECTS.md` for the full map.

## Keep WordPress until cutover

1. Leave the current WordPress site running on SiteGround.
2. Review this rebuild in the preview. Swap real job photos from the WordPress media library into `public/images/` (names: `hero-deck.jpg`, `kitchen.jpg`, `bathroom.jpg`, `garage.jpg`, `porch.jpg`, `basement.jpg`, `addition.jpg`, `commercial.jpg`, `full-home.jpg`, `deck-stairs.jpg`).
3. Push this repository to GitHub when you are happy with the pages.
4. On cutover day, point the SiteGround docroot at the new files (or change DNS). Install `public/.htaccess`, `public/robots.txt`, `public/sitemap.xml`, and `public/contact.php` at the web root.
5. After Google recrawls, retire WordPress.

## Future staging deployment (SiteGround-compatible)

Public pages are files. They do not need MySQL. **Staff admin** (header darkness, cover photo, gallery order) needs PHP + MySQL on the same server. Until the steps below are done, live `/admin/` shows a notice and **will not save settings**.

Do this **on the server**, not in GitHub.

### 1. Confirm PHP landed in the web root

The folder `public/api/bridge/` must be at the staging web root:

`https://YOUR-STAGING-HOST.example/api/bridge/status.php`

Opening that URL should return JSON, not a download and not PHP source.

### 2. Create `config.php` (secrets stay off GitHub)

This file holds the MySQL password and Google sign-in secret. It is gitignored on purpose.

1. Site Tools → File Manager → `api/bridge/`
2. Copy `config.sample.php` → `config.php`
3. Edit `config.php`:
   - `mysql_host` = `localhost` (not the public IP)
   - `mysql_user` / `mysql_database` = the SiteGround MySQL user and database you already created
   - `mysql_password` = the real password (not `CHANGE_ME`)
   - `google_client_id` and `google_client_secret` = from Google (next step)
    - `public_origin` = the explicitly authorized staging origin (never the production WordPress origin)
    - `media_root` = optional persistent path outside the repository's `public/images/` and `public/videos/` seed trees
4. Save. Do **not** copy `config.php` back into GitHub Desktop.

Build the staging frontend with `VITE_PHP_CMS_ENABLED=true`. Without that
explicit flag, the frontend will not call the PHP CMS endpoints—even if it is
running on a Pfeifer-owned hostname. This prevents development and preview
builds from selecting the live CMS based on hostname alone.

### 3. Google sign-in (staff only)

Admin on the live site uses **Google**, and only `@pfeiferbuild.com` accounts.

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create credentials → OAuth client ID → Web application
2. Authorized JavaScript origin: the exact staging origin
3. Authorized redirect URI: `https://YOUR-STAGING-HOST.example/api/bridge/google-callback.php`
4. Paste the client ID and secret into `config.php`

If Google Workspace is locked down, allow this OAuth app for the office.

### 4. Verify

1. Open the staging `/login/` URL
2. Click **Verify setup**
3. Every row should say **Pass**
4. Click **Continue with Google** with an `@pfeiferbuild.com` account
5. Change header darkness on a gallery. That value lives in MySQL (`gallery_settings`) and is **not** overwritten by the next GitHub FTP of seed photos

The PHP bridge's authenticated media endpoints store new photos under `uploads/galleries/` and hero videos under `uploads/videos/` (or the explicit `media_root` configured on staging). They use multipart upload, randomized names, image/MP4 validation, atomic staging, session CSRF/origin checks, and generic client errors. Existing Git-managed seed assets are never overwritten or deleted by these endpoints.

Gallery setting requests update only the fields supplied by the control being used (cover/order, darkness, or video), rather than replacing an entire row from a stale screen. This reduces lost updates while remaining compatible with the existing `gallery_settings` table.

If Verify fails:

| Check | Typical fix |
|---|---|
| PHP bridge is running | Files are under the domain web root; PHP is enabled |
| config.php exists | Copied in File Manager, not only the sample file |
| MySQL password is set | Replaced `CHANGE_ME` |
| MySQL connected | User has all privileges on that database; host is `localhost` |
| Google keys | Client ID + secret in `config.php`; redirect URI exact |

### What still needs the preview (Node)

The staff gallery screen uses the staging PHP endpoints for durable photo/video media operations. The local preview keeps its existing Node processing behavior. No endpoint automatically targets production.

## SiteGround (public site)

- **Form:** `/contact/` and `/get-started/` POST to `contact.php`, which emails `office@pfeiferbuild.com`. If PHP `mail()` is off, create a Formspree form and set the form `action` to that URL.
- **Redirects:** copy `public/.htaccess` to `public_html/.htaccess`.
- **SEO files:** `robots.txt` and `sitemap.xml` belong at the domain root.

## Photos

Placeholder construction photos ship in `public/images/` so the site is not a gray box. Replace them with real Pfeifer jobs before the domain switch. Keep the file names so pages do not break.

## Team photos

This rebuild uses initials for Duey, Brooks, Brian, and Tricia. Drop headshots in later if you want them — do not scrape portraits off the old site without files you own.
