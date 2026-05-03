# Portfolio Deploy Log

## 2026-05-03

### Current Production

- Production URL: `https://juyoung-portfolio.duckdns.org`
- Server: Oracle Cloud VM
- Process: `my-site` systemd service
- Framework: Next.js 15
- Public uploads are served from `/uploads/*`

### Verification

- `/` returned `200`
- `/projects/3` returned `200`
- `/uploads/kis-summary.webp` returned `200`
- Unauthenticated `POST /api/portfolio` returned `401`
- Unauthenticated `POST /api/upload` returned `401`
- Admin login API issued an httpOnly cookie when the configured password matched
- Local production build completed successfully
- Server service was active and Next.js reported ready in under one second
- Desktop and mobile-width browser checks showed the main hero, navigation, project cards, and Korean text without obvious overlap.
- Safari/WebKit-sensitive blur styles include the `-webkit-backdrop-filter` fallback.

### GitHub Safety Rules

- Commit only public-safe source code, public portfolio data, documentation, and intentional public assets.
- Do not commit `.env`, `.env.local`, `.env.oracle`, real admin passwords, API keys, SSH keys, FTP passwords, DuckDNS tokens, or private notes.
- Keep `.env.oracle.example` as placeholders only.
- Keep local editor/AI settings such as `.claude/` and `.vscode/` out of Git.

### Notes

- The active desktop code folder is `/Users/juyoung/Desktop/My_Site`.
- The previous Git-enabled backup folder is `/Users/juyoung/Desktop/My_Site_old_backup`.
- The current upload folder is about 19 MB. Most uploaded screenshots are WebP files, but one PDF is much larger than the images.
- Before deploying large new assets, check upload size and prefer compressed WebP for screenshots.
- Admin uploads now reject unsupported file types. Images must be 8 MB or smaller, PDFs must be 20 MB or smaller, and supported images are converted to compressed WebP files on upload.

### GitHub

- Current public commit: `5826361 Refresh deployed portfolio site`
- Repository: `https://github.com/FutureAria/my_site`
- Ignored locally: `.env.local`, `.env.oracle`, `.claude/`, `.vscode/`, `.next/`, `node_modules/`

### Remaining Maintenance

- `npm audit --omit=dev` reported a Next.js advisory fixed by a newer Next.js release. Update Next.js in a separate maintenance step, then rebuild and redeploy.
- Test on a real Windows browser and iPhone/Safari device when available, because local automated checks cannot perfectly reproduce every OS font/rendering difference.

## 2026-05-04

### Mobile App Shell

- Added a lightweight web app manifest at `/manifest.webmanifest`.
- Added a small SVG app icon and a tiny service worker for production caching.
- The service worker only caches safe public pages and static assets. It skips `/api/*` requests so admin edits and uploads are not cached incorrectly.
- Added mobile safe-area padding for phone browser/app mode and improved tap targets for navigation and theme controls.
- Updated theme handling so dark/light mode also updates browser `theme-color` and `color-scheme`.
- Adjusted mobile hero text wrapping and modal height so Korean text and resume preview behave better on small screens.

### Storage Notes

- New PWA files are very small: `/public/sw.js` and `/public/icon.svg` are each about 4 KB.
- Current `/public/uploads` size is about 19 MB.
- Continue converting screenshots to compressed WebP and avoid uploading large original PNG screenshots unless they are really needed.
