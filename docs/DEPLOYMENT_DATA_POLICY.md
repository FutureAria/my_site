# Deployment Data Policy

## Purpose

This portfolio has two kinds of data:

- Source-controlled public data: code, public portfolio copy, generated project-doc previews, and safe public assets.
- Server-managed runtime data: admin-edited `data/portfolio.json` and files uploaded through the production admin UI.

The deployment flow must not accidentally delete production uploads or secrets.

## Current Rule

- `npm run deploy:oracle` syncs application source to Oracle.
- The deploy script intentionally excludes `data/portfolio.json`.
- The deploy script intentionally excludes `public/uploads/`.
- The deploy script syncs `public/uploads/project-docs/` with delete enabled because those are generated public planning documents.
- `.env.local`, `.env.oracle`, admin passwords, SSH keys, and DuckDNS tokens must never be committed or copied into docs.

## When Copy Changes Need Production Data

If portfolio copy changes are made in local `data/portfolio.json`, do not assume `npm run deploy:oracle` will publish those data changes.

Use this safe sequence:

1. Confirm the local `data/portfolio.json` is public-safe.
2. Back up Oracle `data/portfolio.json`.
3. Sync only `data/portfolio.json` to Oracle.
4. Do not delete or overwrite `public/uploads/`.
5. Rebuild on Oracle.
6. Restart `my-site.service`.
7. Verify `/api/portfolio` and the public pages.

## Verification Checklist

- `npm run build`
- `npm run check:uploads`
- `npm run deploy:oracle`
- `npm run check:oracle`
- `curl -I https://juyoung-portfolio.duckdns.org`
- `curl -s https://juyoung-portfolio.duckdns.org/api/portfolio`
- Browser QA for desktop, mobile, dark theme, and light theme

## Known Upload Note

`/uploads/admin-1777886495176-0.xlsx` may exist only on the Oracle server because it was uploaded through the production admin UI.

If local `npm run check:uploads` reports this file missing, treat it as a server-managed upload unless the file is intentionally replaced through a safe admin or server-data sync flow.

## Do Not Touch

- `.env.local`
- `.env.oracle`
- Admin password values
- SSH keys
- DuckDNS token
- Existing production uploads under `public/uploads/`

