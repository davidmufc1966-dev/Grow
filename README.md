# Plot — installable PWA

This folder is a complete Progressive Web App. Host these files over **HTTPS** and you can install Plot to your phone or desktop home screen, launch it full‑screen, and use it **offline**.

## What's inside
- `index.html` — the app shell
- `app.js` — Plot (your full app, compiled to run in the browser)
- `react.js`, `react-dom.js` — React 18 runtime (bundled locally, no CDN)
- `manifest.webmanifest` — name, colors, icons
- `service-worker.js` — offline caching
- `icon-*.png`, `apple-touch-icon.png` — home‑screen icons

## Put it online (pick one)
**Netlify Drop (easiest):** go to https://app.netlify.com/drop and drag this whole folder in. You get an HTTPS link in seconds.

**GitHub Pages:** create a repo, upload these files, then Settings → Pages → deploy from branch. Works under a subpath because all links are relative.

**Cloudflare Pages / Vercel:** create a project, upload the folder as a static site (no build command, output = this folder).

## Try it locally first (optional)
From this folder:
```
npx serve .
```
Then open the printed `http://localhost:3000`. `localhost` counts as a secure context, so install and offline both work there for testing. (Opening `index.html` as a `file://` will **not** register the service worker — you need a server.)

## Install on your phone
- **iOS Safari:** Share → *Add to Home Screen*.
- **Android Chrome:** menu (⋮) → *Install app* / *Add to Home screen*, or tap the install prompt.

## Notes
- Your saved plot and sow dates are stored locally on the device (via `localStorage`).
- First load needs internet (to fetch the fonts); after that it runs fully offline.
- To ship an update, change `plot-v1` to `plot-v2` in `service-worker.js` so caches refresh.
