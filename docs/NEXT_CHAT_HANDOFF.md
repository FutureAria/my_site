# Next Chat Handoff

Recommended chat title: Portfolio Final QA - SMTP Credential And Mobile Polish

Project: Juyoung Portfolio Site

Project root:

```bash
cd /Users/juyoung/Desktop/My_Site
```

## Current Goal

Finish final production QA for the Next.js portfolio site after the interview-focused project copy and Oracle deployment cleanup.

## Current State

- Production URL: `https://juyoung-portfolio.duckdns.org`
- GitHub repo: `https://github.com/FutureAria/my_site`
- Deploy command: `npm run deploy:oracle`
- Capacity check: `npm run check:oracle`
- Last confirmed build command: `npm run build`
- Last confirmed deploy: Oracle deploy completed after contact mail failure handling.
- Latest committed change before this handoff: contact mail send failures are handled with a user-facing JSON fallback instead of an empty 500.

## Completed Recently

- CRUD broken external demo link was removed and replaced with a neutral maintenance notice.
- Custom portfolio 404 page was added and deployed.
- KIS AI Trader demo was checked as read-only with real-order lock messaging.
- BASE CHAIN ticket flow was checked through the unauthenticated safe stop at login-required state.
- Contact SMTP runtime keys were configured on Oracle without recording secret values.
- Contact API now catches SMTP send failures and supports secure SMTP mode for port `465` or `SMTP_SECURE=true`.
- Contact form failure UI now includes a direct email action.
- Representative project data was checked:
  - KIS AI Trader: personal project, read-only, order locked.
  - BASE CHAIN: latest Oracle demo, MOCK Toss payment, QR/ticket flow.
  - MajorLink: ongoing MVP scope validation.

## Remaining Work

### P0

1. Reissue or replace the SMTP credential.
   - Current blocker: Gmail SMTP returns `EAUTH` / `535 BadCredentials`.
   - Do not commit or print the credential.
2. After replacing the credential, verify production contact form success.
   - Expected API result: `{"success":true}`.

### P1

1. Run final mobile QA for home, representative project detail pages, and contact form.
2. Run final light/dark theme QA for contrast, wrapping, and button states.
3. Recheck production data if the admin page is used.

### P2

1. Optional Claude Sonnet review for final wording/UI skim.
2. Optional README note for current demo status after SMTP is fully working.

## First Commands

```bash
cd /Users/juyoung/Desktop/My_Site
pwd
ls
git status --short --branch
npm run build
```

## Files To Read First

- `README.md`
- `DEPLOY_LOG.md`
- `docs/TASKS.md`
- `data/portfolio.json`
- `components/Contact.tsx`
- `app/api/contact/route.ts`
- `scripts/deploy-oracle-next.mjs`
- `scripts/oracle-env.mjs`

## Files Not To Commit

- `.env.local`
- `.env.oracle`
- Any admin password, SMTP password/app password, SSH key, DuckDNS token, Oracle credential, or wallet file.
- Do not delete or overwrite production `public/uploads`.

## Validation Commands

```bash
npm run build
npm run deploy:oracle
npm run check:oracle
curl -s -i --max-time 30 -X POST https://juyoung-portfolio.duckdns.org/api/contact \
  -H 'content-type: application/json' \
  --data '{"name":"포트폴리오 QA","email":"qa@example.com","message":"운영 연락 폼 전송 확인용 QA 메시지입니다.","website":""}'
```

## Final Output Expected

- Changed files.
- Commands actually run.
- Production verification result.
- Remaining blocker, if any.
- Whether the contact form is fully working or still using fallback behavior.
