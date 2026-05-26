# Portfolio Deploy Log

## 2026-05-26

### About Timeline Evidence Update

- Reworked public timeline cards so each item opens with a clearer click target and a compact three-line bullet summary.
- Added support for multiple timeline evidence documents such as enrollment certificates, PDFs, PPT/PPTX files, and spreadsheets.
- Extended the admin About editor with a three-line summary field and editable timeline document upload/list controls.
- Updated existing timeline copy to be shorter, more interviewer-oriented, and easier to scan before opening details.
- Local production build completed successfully before deployment.

### Oracle Production Deployment

- Deployed the portfolio site to Oracle with `npm run deploy:oracle`.
- Server-side production build completed successfully and `my-site.service` restarted in active/running state.
- Because the deploy script preserves the server's existing `data/portfolio.json`, patched only the five About timeline items on the Oracle server so current admin-managed data was not overwritten.
- Rebuilt and restarted the Oracle service again after the server data patch so the public static output reflects the updated three-line timeline summaries.
- Verified `https://juyoung-portfolio.duckdns.org` returned `200` and included the updated About timeline text.
- Verified `https://juyoung-portfolio.duckdns.org/admin` returned `200`.
- Oracle disk check after deployment showed `45G` total, `9.6G` used, `36G` available, and `/home/ubuntu/my_site` about `685M`.
- `npm audit` during deployment still reported 2 vulnerabilities: 1 moderate and 1 high. They were not fixed in this deployment.

### Skills Section Compact Cleanup

- Removed the large project evidence boxes and round project chips from the skills section.
- Reduced skills card spacing, icon size, and border radius so the section reads closer to the earlier compact tag layout.
- Oracle production deployment has not been run for this cleanup yet.

### Core Strengths Rollback

- Restored the core strengths section to the earlier simple `핵심 역량` card style.
- Removed the extra proof rows, project names, and `근거 보기` links that made the section feel too large and text-heavy.
- Oracle production deployment has not been run for this rollback yet.

### Project Card Copy Compacting

- Shortened the project card overlay badge from a long solved-message style to compact `해결` / `진행` labels.
- Added compact card-only hooks, teasers, role notes, and result notes so project cards scan in one glance before opening details.
- Reduced visible teaser, role, and result copy on cards to one-line summaries and shortened the detail CTA to `상세 보기`.
- Oracle production deployment has not been run for this project-card cleanup yet.

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

### Admin Project Category Picker

- Replaced the project category free-text field with a dropdown plus direct input.
- Existing categories are shown as selectable options and quick buttons, while new categories can still be typed manually.

### Portfolio Security Hardening

- Added admin login failure throttling so repeated wrong password attempts are temporarily blocked.
- Changed uploaded file names from timestamp-based names to random UUID-based names.
- Added file signature checks for image, PDF, Excel, and PowerPoint uploads before saving files.
- Added site-wide security headers including CSP, `nosniff`, frame blocking, referrer policy, and restricted browser permissions.

### Portfolio Reviewer Feedback Updates

- Updated the hero and about copy to introduce Park Ju-young as a computer science student and backend developer candidate with a clearer 2021-2025 learning narrative.
- Added a 2021-2025 timeline item so the portfolio no longer looks empty before the recent project period.
- Split the skill section into backend, database, frontend, DevOps, blockchain, and collaboration tools.
- Changed project role labels to `내 역할 · 규모` and rewrote role text to include project scale without adding unverified claims.
- Removed public phone and Notion homepage contact exposure; the contact menu now leads to contact information, while contact CTA buttons lead directly to the message form.

### Contact Navigation Refinement

- Kept the top `연락처` menu anchored to the contact information section.
- Kept `연락하기` CTA buttons anchored to the message form.
- Added the public email address inside the message form so reviewers can see the destination even when they jump directly to the form.
- Removed phone and homepage rendering from the public contact component to prevent stale contact data from showing again.

### Backend Control Room Local Prototype

- Added a separate local prototype route at `/control-room` for a `Backend Control Room` style first-screen concept.
- The prototype keeps the current production homepage untouched while testing a server-status style hero, email CTA, core strengths, and project category preview.
- Local production build completed successfully after adding the prototype page.

### Portfolio Concept Gallery Prototype

- Added a local-only concept comparison route at `/concepts`.
- Included five lightweight frontend directions: `Backend Runtime`, `Developer Logbook`, `API Documentation`, `JY Workspace`, and `Resolved Issues`.
- Kept the current public homepage unchanged so the concepts can be reviewed before choosing one to promote.
- Local production build completed successfully after adding the concept gallery page.

### AI-Assisted Concept Gallery Revision

- Replaced the first `/concepts` comparison set with AI-assisted portfolio concepts.
- Added five new directions: `AI Command Center`, `AI Pair Programming Desk`, `AI Workflow Timeline`, `AI Lab Notebook`, and `Human + AI Console`.
- Framed AI usage as requirement structuring, implementation support, verification, documentation, and deployment review rather than as automatic replacement.
- Local production build completed successfully after replacing the concept gallery.

### Ten Local Portfolio Concept Pages

- Rebuilt `/concepts` as a local index for ten independent portfolio concept prototypes.
- Added individual local pages for `AI Lab Notebook`, `AI Pair Developer`, `Backend Runtime`, `Developer Growth Map`, `Problem Solver Casebook`, `JY Build Pipeline`, `AI Command Desk`, `Project Archive Room`, `Recruiter Briefing Mode`, and `Human Verified AI Work`.
- Kept the current public homepage unchanged; these concept pages are for local review only.
- Local production build completed successfully, and all `/concepts` pages returned `200` after restarting the local dev server with a clean `.next` directory.

### Remove Local Concept Pages

- Removed the `/concepts` local index and all ten independent concept prototype pages.
- Kept the existing `/control-room` prototype untouched because it was created separately from the ten-page concept set.

### Portfolio Impact Rework

- Created a rollback checkpoint stash before editing: `checkpoint before portfolio impact rework`.
- Reworked the first screen around a stronger backend problem-solver headline and concise bullet-style introduction.
- Added a `제가 풀어본 문제들` section before the project list, linking problem statements to related project details.
- Rewrote the 2021~2025 timeline item to explain why the backend direction became interesting.
- Reorganized public skill categories into Backend, DB, DevOps, Blockchain, and Tools.
- Reduced public contact exposure to email and separated the contact information anchor from the message form anchor.

### Timeline Readability Refinement

- Changed growth timeline cards to show short summary text by default.
- Added click-to-expand behavior so reviewers can open detailed notes, evidence images, PDF links, and keywords only when needed.
- Shortened timeline descriptions for education, 2021~2025 direction change, award, K-Digital training, and Linux study items.

### Project Card Curiosity Refinement

- Reworked project cards to lead with a problem-style hook instead of long role and result text.
- Added short `problem` and `teaser` fields for each project so reviewers see what was built and why it matters before opening details.
- Reduced visible card body text to compact role/result snippets, fewer tech chips, and a stronger `어떻게 풀었는지 보기` detail link.

### Interview-Focused Evidence Flow

- Updated the hero copy to emphasize backend problem decomposition, implementation, and verification rather than a long self-introduction.
- Reworked strengths and skill sections so each item points to project evidence instead of only listing abilities.
- Changed blog cards into interview-question-style notes that start from a concrete problem.
- Rebuilt project detail pages around a question hook, short evidence summary, proof links, and collapsible detail sections.

### Portfolio Readability And Light Theme Refinement

- Shortened the first-screen headline and intro bullets so the hero reads faster.
- Replaced long project-detail question headlines with compact per-project summaries and three short proof cards.
- Collapsed the `문제 · 해결 · 결과` detail block by default so long explanations do not dominate the first view.
- Added light-theme overrides for the hero map, project proof cards, and detail proof cards so they no longer look disabled or gray.

### Oracle Deploy Follow-Up Cleanup

- Fixed the local `Cannot find module './331.js'` dev error by clearing the stale `.next` cache and restarting the dev server.
- Made the hero intro use short fixed lines so older server-side admin data cannot re-expand the first screen copy.
- Shortened the project detail hero by hiding duplicated long descriptions when a curated compact summary exists.
- Excluded the local-only `app/control-room` experiment from Oracle deploys and added remote cleanup for stale `.next` output.

### Interview-Focused Copy And Security Patch

- Updated Next.js from `15.5.15` to `15.5.18` and forced `postcss` to `8.5.10`; `npm audit --omit=dev` now reports `0 vulnerabilities`.
- Shortened public profile, skills, project roles, features, impact, architecture, API, troubleshooting, and takeaway copy into concise reviewer-facing lines.
- Removed weakly supported stack exposure from the public skills map and kept visible skills tied to actual portfolio projects or documented planning work.
- Added bullet-style rendering for multiline project detail text so interviewers can scan role, impact, and design notes quickly.
- Tightened mobile project-detail title wrapping and CTA button layout after checking a 390px-wide local Chrome screenshot.
- Local production build completed successfully with `npm run build` on `2026-05-27 00:06 KST`.
- Pushed commit `a6f5a21` to GitHub `main`, then deployed to Oracle with `npm run deploy:oracle`.
- Oracle deploy completed successfully; remote build used Next.js `15.5.18`, service restarted as `active (running)`, and `/control-room` stayed excluded from the deployed route list.
- Production checks after deploy: `/` returned `200`, `/projects/4` returned `200`, and `/control-room` returned `404`.
- Oracle capacity after deploy: `45G` total, `9.5G` used, `36G` available, `/home/ubuntu/my_site` at `620M`.

### BASE CHAIN Latest Contribution Refresh

- Replaced old BASE CHAIN portfolio screenshots with new Oracle-deployed captures under `/uploads/basechain-latest/`.
- Added the latest BASE CHAIN screens: home, ticket list, MOCK Toss payment, my tickets, resale, market, raffle, exchange, physical exchange, community, and notice.
- Rewrote the BASE CHAIN copy around the latest contribution: code merge, frontend/mobile fixes, backend API fixes, internal error cleanup, MOCK Toss payment, QR entry, points/membership, and Oracle demo flow.
- Kept real payment/onchain wording explicit as `mock/demo-only` so the portfolio does not imply production Toss or real minting.
