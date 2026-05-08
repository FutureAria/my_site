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
- Added small SVG/PNG app icons and a tiny service worker for production caching.
- The service worker only caches safe public pages and static assets. It skips `/api/*` requests so admin edits and uploads are not cached incorrectly.
- Added mobile safe-area padding for phone browser/app mode and improved tap targets for navigation and theme controls.
- Updated theme handling so dark/light mode also updates browser `theme-color` and `color-scheme`.
- Adjusted mobile hero text wrapping and modal height so Korean text and resume preview behave better on small screens.

### Storage Notes

- New PWA files are very small: `/public/sw.js` and `/public/icon.svg` are each about 4 KB, with PNG app icons under 10 KB each.
- Current `/public/uploads` size is about 19 MB.
- Continue converting screenshots to compressed WebP and avoid uploading large original PNG screenshots unless they are really needed.

### Admin Editing

- Added a blog management tab to `/admin`.
- Blog posts can now be added, edited, deleted, reordered, collapsed, expanded, and opened in a new tab for preview.
- Editable blog fields: title, date, tags, card summary, and Markdown body.
- Blog data remains inside `data/portfolio.json`, so admin saves continue to update the same lightweight JSON file.

### Resume PDF Fix

- The resume preview was blank because `data/portfolio.json` pointed to `/uploads/project-1775449898435.pdf`, but the file was missing on the Oracle server.
- Local file exists and is a valid PDF, about 15 MB.
- Oracle disk check showed about 39 GB available, so this PDF is acceptable for now.
- Updated the Oracle deploy script so missing upload PDFs are seeded to the server without deleting or overwriting existing server uploads.

### Project Filter Cleanup

- Project technology filters now show only the important tags first.
- Deployment-related tags such as Oracle Cloud and Caddy are prioritized because they help explain the deployed projects.
- Less important tags are hidden behind a `+ n개 더보기` control to keep the project section easier to scan.

### Dependency Maintenance

- Updated `next` from `15.5.14` to `15.5.15`.
- Updated `nodemailer` from `8.0.5` to `8.0.7`.
- Local production build completed successfully with Next.js `15.5.15`.
- `npm audit --omit=dev` still reports a moderate `postcss` advisory through Next.js internal dependency `next/node_modules/postcss`.
- Do not run `npm audit fix --force` for this warning: npm currently proposes installing `next@9.3.3`, which would be a breaking downgrade.
- Checked `next@16.2.4`; it still declares internal `postcss` as `8.4.31`, so a major Next.js upgrade alone may not clear this specific audit warning.

### KIS Demo Guidance

- Added a read-only demo guide to the KIS AI Trader project detail page.
- The live demo CTA now can use a project-specific label such as `읽기 전용 데모 입장`.
- Added public read-mode password display for portfolio reviewers; this is separate from the portfolio admin password.
- Added copy explaining that all visitors see the same shared read-only demo screen and cannot use admin or real-order features.
- Added admin form fields for project demo CTA label, public read-mode password, and read-only guide text.
- Updated the KIS live demo link to `/read-demo`, which should issue a read-only session and redirect reviewers to the shared web dashboard when the KIS panel is deployed.
- Deployed the KIS panel `control_panel.py` update to Oracle.
- Added KIS `/read-demo` and `/demo` routes that issue only the existing read-only `view` session cookie, then redirect to `/web#summary`.
- Verified `https://juyoung-quant.duckdns.org/read-demo` returns `303` to `/web#summary`, and the followed page returns `200` with `data-mode="readonly"`.
- Deployed the portfolio site to Oracle and updated the server-side `data/portfolio.json` KIS project entry without overwriting the whole data file.
- Verified `https://juyoung-portfolio.duckdns.org/projects/3` showed the previous public read password before the read demo was later changed to passwordless entry.

### Project Screenshot Lightbox

- Added a reusable project screenshot gallery component.
- Project detail screenshots now open in a large modal when clicked.
- The modal supports close button, outside-click close, Escape close, and left/right navigation.
- Local production build completed successfully after the gallery change.

### Portfolio Project GitHub Links

- Found and prepared public-safe copies for three older portfolio projects.
- Uploaded `장바구니 기능 기반 수강신청 웹 플랫폼` to `https://github.com/FutureAria/Course-registration`.
- Uploaded `CRUD 기반 물품 관리 웹 시스템` to `https://github.com/FutureAria/CRUD`.
- Uploaded `데이터 기반 AI 상권 분석 및 추천 서비스` to `https://github.com/FutureAria/Commercial-District`.
- Excluded `.env`, `node_modules`, `target`, build outputs, logs, `.DS_Store`, and local backup artifacts from the public uploads.
- Replaced public upload copies of API keys, DB passwords, and map/API keys with environment-variable placeholders before committing.
- Updated portfolio project source links so the source-code buttons point to the new GitHub repositories.
- Added the CRUD live demo link `https://juyoung-crud.duckdns.org` to the portfolio project card.

### CRUD Demo Loading Screen

- Added a lightweight inline loading screen to the CRUD demo `index.html`.
- The loader uses only text, system fonts, and three CSS dots; no image or extra network request was added.
- Rebuilt the CRUD static app and deployed it to `/home/ubuntu/juyoung-crud`.
- Updated Caddy so Vite `/assets/*` files use long immutable caching.
- Verified the deployed HTML includes `물품 관리 시스템 로딩 중`, and the JS asset is served with gzip compression and long cache headers.

### Project Planning Documents

- Generated public-safe planning XLSX files for all six portfolio projects using the MajorLink planning workbook as the structure reference.
- Added lightweight HTML previews beside each XLSX file so visitors can open the planning document inside the portfolio and also download the original Excel file.
- Added a project document viewer route at `/projects/[id]/documents/[docIndex]`.
- Added project document links to project cards and project detail pages.
- Added admin project document management fields for title, description, file URL, preview URL, type, add, delete, and XLSX upload.
- Extended `/api/upload` to accept Excel files while keeping image WebP compression for images only.
- Local production build completed successfully with Next.js `15.5.15`.

### Portfolio Home Speed Optimization

- Converted the portfolio home page from fully dynamic rendering to a 60-second revalidated static page.
- Reduced home page payload by sending only project card data and blog summaries to the first page instead of full project details and blog bodies.
- Deferred below-the-fold sections after the hero so the first HTML focuses on the opening screen.
- Updated the service worker cache version and added a 500ms navigation fallback to cached home content for repeat visits.
- Updated Caddy on Oracle so `/_next/static/*` files are served by Caddy instead of Node while the home route keeps Next.js revalidation for admin edits.
- Local built home HTML dropped from about 132KB to about 35KB, and gzip size dropped to about 10KB.

### Admin Hash Route Guard

- Added an early browser-side guard for mistyped admin URLs such as `/#projects/admin`, `#/admin`, or `#admin`.
- Direct `/admin` already responded normally, but hash fragments are not sent to the server, so this guard redirects those hash URLs to `/admin` before the home page interaction continues.
- Bumped the service worker cache name so older cached home HTML is cleared and the admin hash guard reaches repeat visitors.

### Project Document Status Labels

- Updated generated project planning documents so completed projects show `완료`, KIS and AI emotion analysis remain `진행 중`, and BASE CHAIN is labeled `고도화 중`.
- Updated the BASE CHAIN portfolio period label from `진행 중` to `고도화 중`.
- Updated the Oracle deploy script to overwrite only `public/uploads/project-docs` while still preserving other uploaded files.

### Public KIS Read Demo

- Removed the public read-mode password from the KIS portfolio detail page and admin editor.
- Kept the KIS demo CTA on `/read-demo` so portfolio reviewers enter the shared read-only demo directly.
- Deployed the KIS read-only panel so `/read-demo` issues a public read-only session without requiring a read-mode password.

### KIS Demo First Load Optimization

- Removed the heavy live status lookup from the public KIS start page so `https://juyoung-quant.duckdns.org/` can render from lightweight fixed mode labels.
- Avoided the local IP lookup on public-domain requests; it now only runs for local `localhost` or `127.*` requests.
- Added a short private browser cache for the public KIS start page to make refreshes and quick revisits faster without caching admin or API pages.
- Deployed the KIS read-only panel update to Oracle and verified the service stayed active.

### KIS History Trading-Day Filter

- Updated the KIS history API so paper daily result records are kept only for KRX trading days.
- Weekend and exchange-holiday dates are filtered out before selected-date, calendar, rail, and archive records are calculated.
- Added a frontend safety filter so stale cached weekend records are ignored by the history calendar.
- Updated empty weekend cells to show as closed days instead of looking like valid paper-trading history records.
- Deployed the KIS read-only panel update to Oracle and verified `2026-05-02` and `2026-05-03` no longer appear in `/api/brain_paper_daily_results`.

### Award Certificate Attachments

- Added optional certificate image and certificate PDF fields to about timeline items.
- Award and certificate cards now show a `상장 있음` badge when proof files are attached.
- Certificate images can be opened from the portfolio card, while certificate PDFs support both view and download actions.
- Admin timeline items now provide separate upload, view, and delete controls for certificate PNG/JPG images and PDF files.
- Local production build completed successfully after the award attachment update.

### Timeline Proof Attachments

- Expanded the proof upload controls from only award/certificate items to every about timeline type: education, training, career, award, and certificate.
- Renamed the public badge and admin labels from award-specific wording to `증빙 있음` and `증빙 자료` so they fit school, education, career, awards, and certificates.
- Local production build completed successfully after expanding the timeline proof controls.

### Portfolio Evaluation Evidence Fields

- Added project-level evaluation fields for core impact, problem, solution, result, architecture, ERD/DB design, API spec, troubleshooting, README/document link, mobile check, browser compatibility, performance, security, and operations notes.
- Project cards now surface `핵심 성과` when it is available so reviewers can understand the project value before opening the detail page.
- Project detail pages now show dedicated sections for `문제 · 해결 · 결과`, `설계 / 문서`, `트러블슈팅`, and `검증 / 운영 기록`.
- Admin project editing now supports all added fields, so the portfolio can keep updating the same JSON data without code edits.
- Filled the six current portfolio projects with public-safe project evidence text based on existing implementation scope and deployment notes.
- Synced the public-safe live portfolio JSON back to the local repository data so admin-added projects such as `Major_Link` are not lost in future GitHub/deploy cycles.

### Project Category Sections

- Added a project `category` field and grouped the portfolio project list into `대표 프로젝트`, `백엔드 기초 프로젝트`, `개발 중 · 기획 프로젝트`, and `기타 프로젝트`.
- Assigned KIS AI Trader, BASE CHAIN, Commercial District, and Major_Link as representative projects.
- Assigned Course Registration and CRUD as backend foundation projects, and AI emotion music as a development/planning project.
- Added an admin project category field so future projects can be moved between sections without code changes.

### Admin Project Header Mobile Fix

- Updated admin project accordion headers so long project titles and periods wrap cleanly on mobile.
- Moved project move/delete actions below the title row on small screens to prevent overlap and improve touch spacing.
- Added a compact mobile category badge in collapsed project headers so project grouping remains visible while editing.

### Project Document Upload Fix

- Expanded project document uploads from Excel-only to `xlsx`, `xls`, `pptx`, `ppt`, and `pdf`.
- Updated the admin upload button label from `엑셀 파일 업로드` to `문서 파일 업로드`.
- The uploaded document type now follows the actual uploaded file extension instead of defaulting to `xlsx`.
- Removed unverified mobile-check text from Course Registration, CRUD, and Commercial District project evidence fields.

### Remove Unverified Project Claims

- Cleared project evidence fields for mobile/device checks, browser compatibility checks, performance results, security checklist, and operations/deployment notes across all projects.
- These fields should be filled only after the specific project has actually been checked or the evidence is documented.

### Admin Document Item Collapse

- Changed individual project document editor cards into collapsible rows.
- Document items now show only the document number, title, and type until opened, reducing admin page height when multiple files are attached.
