# Plot — installable PWA (single-file build)

The whole app lives inside `index.html`; the other files just make it installable and offline-capable.

## Files
- `index.html` — the entire Plot app (React bundled inside)
- `manifest.webmanifest`, `service-worker.js` — installability + offline
- `icon-*.png`, `apple-touch-icon.png` — home-screen icons

## Deploy (HTTPS required for install)
Drag this whole folder onto https://app.netlify.com/drop (or GitHub Pages / Cloudflare Pages). All paths are relative, so a subpath is fine.

## Install on your phone
- iOS Safari: Share -> Add to Home Screen
- Android Chrome: menu -> Install app

## Updating
The service worker is network-first, so once this version is live, future redeploys appear on the next reopen automatically (no cache dance). To force a hard refresh of an older install, remove the app and re-add it once after deploying.

Your saved plot + sow dates are stored locally on the device.
