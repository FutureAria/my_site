# Juyoung Portfolio

Personal portfolio website for projects, resume, blog-style records, skills, and contact information.

## Current Production Status

- Production site: https://juyoung-portfolio.duckdns.org
- Main portfolio direction: interview-friendly project reading path.
- Representative projects:
  - BASE CHAIN: latest Oracle demo, MOCK Toss Payments flow, ticket/QR flow.
  - KIS AI Trader: personal project, read-only demo, real-order flow locked.
  - MajorLink: ongoing project, MVP scope and planning evidence.
- Contact form:
  - The form is guarded with validation, honeypot, rate limiting, and escaped HTML.
  - If SMTP send fails, visitors see a direct email fallback action.
  - Current remaining blocker: Gmail SMTP credential must be reissued or replaced before automatic mail delivery can return `success: true`.

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Oracle Deploy

Create `.env.oracle` from `.env.oracle.example`, then fill in the private server values locally.

```bash
npm run deploy:oracle
```

Use this only from a trusted local machine. The real `.env.oracle` file must not be committed.

`npm run deploy:oracle` preserves server-managed `data/portfolio.json` and `public/uploads/` by default. If local portfolio copy must replace production admin data, follow [docs/DEPLOYMENT_DATA_POLICY.md](docs/DEPLOYMENT_DATA_POLICY.md) and back up the Oracle data first.

## Verification

```bash
npm run build
npm run check:oracle
curl -sS https://juyoung-portfolio.duckdns.org/api/health
```

After the SMTP credential is replaced, verify contact delivery with a production `POST /api/contact` request and confirm the message arrives in the inbox.

## Admin

The admin page uses an environment-based password and an httpOnly cookie. Write APIs are protected by middleware.

Never commit the real admin password.

## Security Notes

Never commit `.env.local`, `.env.oracle`, admin passwords, SMTP passwords, SSH keys, DuckDNS tokens, Oracle credentials, or wallet files.

Do not overwrite or delete production `public/uploads/` unless the server data has been backed up and the change is intentional.
