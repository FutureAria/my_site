# Portfolio Deploy Log

## 2026-06-01

### CRUD Demo Link Safety

- Checked all public demo, GitHub, and document links after deployment.
- Found `https://juyoung-crud.duckdns.org` failing with `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`.
- Removed the CRUD external demo URL from the public portfolio data so reviewers are not sent to a broken HTTPS endpoint.
- Added a short CRUD demo notice: external live demo is under HTTPS inspection, while implementation can be checked through GitHub and the planning document.
- Renamed the shared project demo notice heading from `읽기 전용 데모 안내` to the more neutral `데모 안내`.

### Final QA and 404 Page

- Verified the KIS read-only demo enters `https://juyoung-quant.duckdns.org/web#summary` and shows read-only/order-lock wording.
- Verified the BASE CHAIN ticket flow loads and stops unauthenticated reviewers at the login-required modal before any payment data is entered.
- Confirmed the production contact API returns `SMTP_NOT_CONFIGURED`; Oracle `.env.local` is missing SMTP settings, so real mail delivery still requires an approved credential update.
- Added a custom portfolio-style 404 page with links back to representative projects and the contact form.

## 2026-05-31

### About, KIS, MajorLink, and Data Policy Cleanup

- Tightened the About intro and timeline copy so the first scan is shorter and more backend-focused.
- Updated source data settings so the representative project indexes point to `KIS AI 트레이더`, `BASE CHAIN`, and `MajorLink`.
- Strengthened KIS copy around `개인 프로젝트`, `읽기 전용`, and `실제 주문 잠금` in card and detail-page summaries.
- Strengthened MajorLink copy as a 진행 중 project by showing the MVP slice: profile, recruiting post, application/approval, and tag search.
- Added `docs/DEPLOYMENT_DATA_POLICY.md` and linked it from `README.md` to document the Oracle data sync rule.
- Local `npm run build` completed successfully.
- Local `npm run check:uploads` completed with the known missing local admin upload reference: `/uploads/admin-1777886495176-0.xlsx`.
- Local browser QA confirmed the home page, KIS detail page, and MajorLink detail page expose the updated interview-focused copy with no console errors.
- Mobile light-theme QA at a 390px viewport confirmed no horizontal overflow on the home page, KIS detail page, and MajorLink detail page.
- Committed and pushed to GitHub: `ca495ed Refine portfolio project positioning`.
- Follow-up pushed: `3f1f9c5 Clarify MajorLink MVP headline`.
- Ran `npm run deploy:oracle`; Oracle-side build completed successfully and `my-site.service` restarted in active/running state.
- Backed up the Oracle server `data/portfolio.json`, then synced the local public-safe `data/portfolio.json` without touching `public/uploads`.
- Rebuilt on Oracle and restarted `my-site.service` after the server data sync.
- Ran `npm run check:oracle`; Oracle disk showed `45G` total, `9.9G` used, `36G` available, and `/home/ubuntu/my_site` about `631M`.
- Verified production `/api/portfolio` shows representative project indexes `[3,4,6]` and the updated KIS/MajorLink copy.
- Verified `https://juyoung-portfolio.duckdns.org` returned `200`.

## 2026-05-29

### Interview-Focused Portfolio Cleanup

- Returned from the paused Notion portfolio work to the Next.js portfolio site.
- Re-centered the representative project grouping around `BASE CHAIN`, `KIS AI 트레이더`, and `MajorLink`.
- Moved the AI commercial-area project out of the representative group so the first scan matches the current portfolio direction.
- Renamed `Major_Link` display copy to `MajorLink`.
- Kept KIS copy as a personal project with read-only public viewing and real-order locking.
- Kept BASE CHAIN copy aligned with the latest Oracle demo and MOCK Toss payment boundary.
- Fixed light-theme media overlay text so project image titles remain readable on dark image gradients.
- Local `npm run build` completed successfully.
- Local `npm run check:uploads` completed with one known missing local admin upload reference: `/uploads/admin-1777886495176-0.xlsx`. This file is treated as an existing server-side admin upload and must not be deleted from Oracle.
- Browser QA checked the home hero, representative-project route, BASE CHAIN detail hero, desktop light theme, and mobile dark viewport.
- Committed and pushed to GitHub: `7c12eaa Focus portfolio representative projects`.
- Ran `npm run deploy:oracle`; Oracle-side `npm ci`, `npm run build`, and `my-site.service` restart completed successfully.
- Ran `npm run check:oracle`; Oracle disk showed `45G` total, `9.7G` used, `36G` available, and `/home/ubuntu/my_site` about `625M`.
- After deployment, production HTML still showed the preserved server `data/portfolio.json`, so server data sync is required before final production verification.
- Backed up the Oracle server `data/portfolio.json`, then synced the local public-safe `data/portfolio.json` and `DEPLOY_LOG.md` without touching `public/uploads`.
- Rebuilt on Oracle and restarted `my-site.service`; service returned to active/running state.
- Verified production `/api/portfolio` now shows `BASE CHAIN`, `KIS AI 트레이더`, and `MajorLink` as representative projects, while the AI commercial-area project is under `백엔드 기초 프로젝트`.
- Verified `https://juyoung-portfolio.duckdns.org` and `/projects/4` returned `200`; BASE CHAIN detail includes `MOCK 결제`, `Oracle 배포본`, and the light-theme media text class.

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

### BASE CHAIN Contribution Framing

- Added screenshot captions so each BASE CHAIN image explains what the interviewer is looking at before opening the modal.
- Added a dedicated `전체 프로젝트 기능 / 제가 맡아 정리한 부분` section to separate team-wide functionality from the latest personal contribution.
- Tightened the BASE CHAIN card teaser so the first read emphasizes the current Oracle demo flow instead of the older mini-project framing.

### Interview Route Navigation

- Added a first-screen recommended reading path: BASE CHAIN, KIS AI Trader, then MajorLink.
- Added the same interview route above the project filters so reviewers can jump to the strongest evidence without scanning every card.
- Updated the BASE CHAIN project card copy to emphasize the latest integrated demo, MOCK payment, QR entry, and Oracle deployment evidence.
- Checked 390px mobile home and BASE CHAIN detail with browser automation; fixed the BASE CHAIN Korean title wrapping so words like `야구` do not split awkwardly.

### Representative Project Interview Prep

- Reframed KIS AI Trader as a personal project, not a team project, and clarified that AI is used for judgment support while implementation, safety boundaries, and operations are handled directly.
- Added `전체 기능 / 제 기여` and screenshot captions for KIS AI Trader, with read-only/no-order boundaries shown as the main safety evidence.
- Added three interview questions to KIS AI Trader, BASE CHAIN, and MajorLink so each representative project can lead into technical interview discussion.
- Started light-theme QA for the new interview route and project-detail cards.
- Added a planning-specific `전체 기능 / 제 기여` split to MajorLink so the development-before-implementation evidence is also scan-friendly.
- Strengthened light-theme cyan CTA contrast after reviewing mobile screenshots for the representative project detail pages.

### Project Navigation Service Worker Fix

- Fixed a production navigation issue where the service worker could race project-detail navigations against a stale cached root page.
- Stopped the service worker from handling Next.js RSC requests, including `_rsc` and `RSC` header requests, so internal component payloads cannot be shown as page text.
- Changed project-detail navigations such as `/projects/3` to network-only document loads while keeping static asset caching for `/_next/static/`.
- Added service-worker update handling in `PwaRegister` so existing browsers pick up the corrected worker and reload once when the controller changes.
- Verified `npm run build` locally and checked localhost production navigation with service workers enabled: home to KIS detail rendered HTML normally instead of raw `$React.fragment` text.
- Switched internal project-card and interview-route jumps to Next `Link` so representative project detail pages can use client-side navigation instead of full document reloads.
- Re-applied the Oracle Caddy setup so gzip/zstd compression is active for production HTML responses.
- Changed project detail and document routes from per-request dynamic rendering to 60-second ISR with generated params, reducing repeated server-render cost while still allowing updated portfolio data to refresh shortly after deployment/admin edits.

### Portfolio Click Speed And First Screen Polish

- Shortened representative project card role/result copy so mobile cards show the key point without ellipsis-heavy text.
- Shortened the first proof cards for KIS, BASE CHAIN, and MajorLink so the detail first screen answers problem, role, and result faster.
- Added project-card hover/focus/touch prefetch for detail routes before navigation.
- Deferred GitHub stats requests until each card is near the viewport and the browser is idle, reducing noisy background requests during first read and click.
- Reworded the KIS problem-first home card around verifiable AI judgment and locked real orders, matching the current personal-project framing.
- Removed the service-worker controller-change auto reload because it could interrupt the first click after a worker update; the worker still checks for updates on registration.
- Added a hard timeout fallback to deferred home sections so the project list appears even when `requestIdleCallback` is delayed by browser/network activity.
- Removed the home-section deferral entirely after production verification showed project cards could appear too late for fast click-through.
- Converted first-screen recommended project links in the hero from plain anchors to Next `Link` and prefetched BASE CHAIN, KIS, and MajorLink on home load.

### Home Focus Backup And Hero Refinement

- Created a remote backup branch and tag before changing the homepage focus so the previous version can be restored if needed.
- Reduced first-screen CTA competition by removing the secondary `문제 보기` button and changing the email CTA to a shorter `연락하기` label.
- Reframed the hero around the three representative projects instead of repeating a generic interview map.
- Rewrote core-strength cards from generic skill claims into project-grounded problem statements: state flow, critical data, deployment debugging, and verifiable AI output.

### Interview Click Path Tightening

- Renamed project-card actions from generic labels to interview-oriented actions: `문제 해결 보기`, `운영 화면 보기`, and `설계 문서 보기`.
- Moved `전체 기능 / 제 기여` above the tech stack on project detail pages so contribution evidence appears before stack labels.
- Compressed the about section into three short bullet cards and reduced vertical spacing so the page gets back to projects faster.

### Hero Quick Links Alignment Fix

- Replaced the oversized pill-style `바로 볼 프로젝트` links with a compact aligned panel.
- Kept the three recommended project links visible while making their spacing stable across desktop and mobile widths.
- Shortened the hero intro copy so mobile widths do not clip the first-screen explanation.

### About Indent And Ongoing Project State

- Adjusted the about intro bullets to use a fixed bullet column so wrapped lines stay aligned with the text.
- Changed MajorLink card copy and badge from completed-style wording to `진행 중` / `MVP 범위 정리 중`.

### Admin Editor Latest Portfolio Sync

- Made project cards prefer admin-managed portfolio data before fallback copy so admin edits stay reflected on the public site.
- Added public-card preview/status chips to the admin project editor, including `진행 중` detection for ongoing projects.
- Added admin controls for `전체 기능 / 제 기여`, takeaways, and interview Q&A fields used by the latest project detail pages.
- Synced stored project card copy to the latest concise interview-facing wording, including ongoing wording for MajorLink and the music recommendation project.

### Admin Save Guard And Status Labels

- Added a save confirmation step with changed-project summary before the admin page writes portfolio data.
- Added an unsaved-change summary banner so accidental broad admin edits are easier to spot before saving.
- Made project detail pages prefer admin-managed card/detail copy before fallback copy, matching the project card behavior.
- Split ongoing labels into `진행 중`, `개발 중`, and `기획 검증 중` so MajorLink does not look like a completed implementation.

### Admin Security And Metadata Hardening

- Added CSRF double-submit protection for admin write APIs and upload requests.
- Added timestamped `data/backups/portfolio-*.json` backups before admin portfolio saves.
- Added upload event logging and a `npm run check:uploads` script to report referenced, missing, and unreferenced upload files without deleting them.
- Updated robots and sitemap URLs to the production DuckDNS domain and added admin `noindex` metadata.
- Added a portfolio Open Graph image and linked it from global metadata for richer link previews.
- Moved the ignored local `app/control-room` experiment route into `data/backups/local-routes/control-room/` so it cannot be included in production builds.

### Admin Password And Predeploy Checks

- Added `ADMIN_PASSWORD_HASH` support using PBKDF2 so production can avoid storing the admin password in plain text.
- Added `npm run admin:hash` to generate a deployable admin password hash without printing or committing secrets.
- Added `/api/health` to verify portfolio data parsing and upload-directory availability without exposing secret values.
- Added `npm run predeploy:check` to run upload-reference reporting and a production build before deployment.

### Admin Recovery And Audit Tools

- Added masked admin login audit logging to `data/admin-auth-events.jsonl` without storing passwords or tokens.
- Added authenticated `/api/admin/backups` endpoints to list portfolio backups and restore a selected backup after creating a pre-restore backup.
- Added an admin `운영` tab with health status and recent backup restore controls.
- Reduced public `/api/health` output to `ok` unless the requester is already authenticated as admin.
- Surfaced `제가 기여한 부분` in the first project-detail screen so interviewers see contribution evidence before deeper sections.

### Save Failure, Contact Guard, And Backup Retention

- Added explicit admin save failure messages for expired sessions, CSRF token errors, server errors, and network failures.
- Added contact-form honeypot, per-client rate limiting, email validation, length limits, and HTML escaping for outgoing messages.
- Limited automatic portfolio backups to the latest 30 files to avoid unbounded Oracle disk growth.
- Updated Oracle setup scripts to support `ADMIN_PASSWORD_HASH` without requiring a plain admin password.
- Compressed KIS, BASE CHAIN, and MajorLink detail copy toward `문제 / 내 역할 / 결과` first-screen reading.

### Hero Interview Route Simplification

- Removed duplicate hero project-link groups from the left column and the lower right card.
- Kept a single clickable `가장 먼저 볼 3개` route on the right so the first screen has one clear project path.

### Contact SMTP Runtime Guard

- Configured the Oracle runtime `.env.local` with the required SMTP key names without recording secret values in Git or docs.
- Restarted `my-site.service` and confirmed the runtime sees `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO`.
- Production contact-form POST changed from `SMTP_NOT_CONFIGURED` to SMTP authentication failure, confirming the remaining blocker is credential/provider-side authentication.
- Added guarded mail-send error handling so visitors receive a JSON fallback message instead of an empty 500 response.
- Added SMTP secure-mode detection for port `465` or explicit `SMTP_SECURE=true`.
- Added a visible fallback email action inside the contact form error state so visitors can still contact directly while SMTP credentials are being reissued.
- Added light-theme contrast overrides for the contact-form error panel and fallback email action.
- Added `docs/TASKS.md` and `docs/NEXT_CHAT_HANDOFF.md` with the remaining SMTP credential blocker, final QA list, and safe validation commands.
- Remaining Decision Required: replace or reissue the Gmail/app-password credential, then rerun production contact-form POST verification.
