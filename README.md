# Pfeifer Building Company website

Replacement for the public WordPress site at [pfeiferbuild.com](https://pfeiferbuild.com). Same brand, same service area, same URL paths so Google does not drop the current pages. No WordPress, no CMS login, no plugins.

Office: 1415 Senoia Road, Suite B, Tyrone, GA 30290 · 770-487-1380 · office@pfeiferbuild.com

## What this is

A brochure site a homeowner in Fayette or Coweta County can use to call, email, or request a bid. Pages live at the old WordPress permalinks (`/decks-by-pfeifer/`, `/peachtree-city-ga/`, `/finished-basement/`, and the rest). See `REDIRECTS.md` for the full map.

## Keep WordPress until cutover

1. Leave the current WordPress site running on SiteGround.
2. Review this rebuild in the preview. Swap real job photos from the WordPress media library into `public/images/` (names: `hero-deck.jpg`, `kitchen.jpg`, `bathroom.jpg`, `garage.jpg`, `porch.jpg`, `basement.jpg`, `addition.jpg`, `commercial.jpg`, `full-home.jpg`, `deck-stairs.jpg`).
3. Push this repository to GitHub when you are happy with the pages.
4. On cutover day, point the SiteGround docroot at the new files (or change DNS). Install `public/.htaccess`, `public/robots.txt`, `public/sitemap.xml`, and `public/contact.php` at the web root.
5. After Google recrawls, retire WordPress.

## SiteGround

- **Form:** `/contact/` and `/get-started/` POST to `contact.php`, which emails `office@pfeiferbuild.com`. If PHP `mail()` is off, create a Formspree form and set the form `action` to that URL.
- **Redirects:** copy `public/.htaccess` to `public_html/.htaccess`.
- **SEO files:** `robots.txt` and `sitemap.xml` belong at the domain root.

## Photos

Placeholder construction photos ship in `public/images/` so the site is not a gray box. Replace them with real Pfeifer jobs before the domain switch. Keep the file names so pages do not break.

## Team photos

This rebuild uses initials for Duey, Brooks, Brian, and Tricia. Drop headshots in later if you want them — do not scrape portraits off the old site without files you own.
