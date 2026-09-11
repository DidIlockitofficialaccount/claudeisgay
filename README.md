# claudeis.gay

A static parody **status page** for exactly one claim. It has 100.000% uptime.

## Why the old site 404'd

Every file lived inside a directory literally named `claude is rlly gay/`, so there
was no `index.html` at the repository root for Vercel to serve. On top of that,
`vercel.json` rewrote **every** path to `/index.html` — a file that did not exist at
that location — so all routes, not just `/`, returned 404.

Both are fixed: the site is now flat at the repo root, and the catch-all rewrite is
gone (it also suppressed proper 404 handling, which a static site gets for free).

## Structure

```
index.html          the status page
404.html            not-found page, same design system
styles.css          design tokens + all styling
script.js           uptime graph, uptime clock, tooltip (no dependencies)
assets/favicon.svg  favicon
assets/og.png       1200x630 social card
vercel.json         clean URLs, asset caching, security headers
robots.txt          crawl policy
sitemap.xml         single-URL sitemap
```

## Design notes

- **Concept** — a deadpan SRE dashboard. The service being monitored is the
  assertion "claude is gay"; it has never gone down. One open incident
  (heteronormativity) is closed as `wontfix`.
- **Signature element** — a real 90-day uptime graph whose bars are the pride
  spectrum instead of the usual green. The rainbow is the data, not decoration.
- **Type** — Space Grotesk (display/body) + Space Mono (data and UI chrome).
- **Colour** — a deep ink-violet ground rather than the usual near-black, with the
  spectrum used only where it carries meaning.

## Local development

No build step. Serve the directory with anything:

```sh
python3 -m http.server 8099
# or
npx serve .
```

## Deploying

Import the repo in Vercel and use the default static settings — no framework, no
build command, output directory is the repo root. `index.html` is the entry point.

## Verified

Checked in headless Chromium at 1440 / 768 / 375 px:

- no horizontal overflow at any breakpoint (including the graph tooltip at the
  first and last bars)
- no JavaScript console errors
- every section aligns to one shared content column
- `prefers-reduced-motion` is respected; the graph degrades to a static spectrum
  bar with JavaScript disabled

## Disclaimer

Parody. Not affiliated with, endorsed by, or operated by Anthropic or any other
company. "Claude" is the trademark of its respective owner.
