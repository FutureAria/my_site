# Next Chat Handoff

Recommended chat title: Portfolio SMTP Credential Final Check

Project: Juyoung Portfolio Site

Project root:

```bash
cd /Users/juyoung/Desktop/My_Site
```

## Current Goal

Finish the only remaining P0: replace the Gmail SMTP app password or SMTP credential, then verify the contact form returns `success:true`.

## Current State

- Production URL: `https://juyoung-portfolio.duckdns.org`
- GitHub repo: `https://github.com/FutureAria/my_site`
- Deploy command: `npm run deploy:oracle`
- Capacity check: `npm run check:oracle`
- Last confirmed build command: `npm run build`
- Last confirmed deploy: Oracle deploy completed after the MajorLink GitHub repository update.
- Latest confirmed production health check: `/api/health` returned `{"ok":true}` on 2026-06-04.
- Latest confirmed Oracle capacity: 45G total, 10G used, 36G available, site directory 627M.
- Current Git note: tracked files are clean on `main`; there are unrelated untracked prompt/log docs under `docs/` that should not be touched unless the user asks.

## Completed Recently

- CRUD broken external demo link was removed and replaced with a neutral maintenance notice.
- Custom portfolio 404 page was added and deployed.
- KIS AI Trader demo was checked as read-only with real-order lock messaging.
- BASE CHAIN ticket flow was checked through the unauthenticated safe stop at login-required state.
- Contact SMTP runtime keys were configured on Oracle without recording secret values.
- Contact API now catches SMTP send failures and supports secure SMTP mode for port `465` or `SMTP_SECURE=true`.
- Contact form failure UI now includes a direct email action.
- README now documents production status, representative project framing, contact fallback, verification commands, and credential safety notes.
- MajorLink GitHub repository link was added and verified in production:
  - `https://github.com/FutureAria/Major.git`
  - Production home HTML and `/projects/6` HTML include the link.
- Representative project data was checked:
  - KIS AI Trader: personal project, read-only, order locked.
  - BASE CHAIN: latest Oracle demo, MOCK Toss payment, QR/ticket flow.
  - MajorLink: ongoing MVP scope validation with GitHub repo link.

## Remaining Work

### P0

1. Reissue or replace the SMTP credential.
   - Current blocker: Gmail SMTP returns `EAUTH` / `535 BadCredentials`.
   - Confirmed email setup: public email, `CONTACT_TO`, and `SMTP_USER` are `juwwkd89@gmail.com`.
   - Do not commit or print the credential.
2. After replacing the credential, verify production contact form success.
   - Expected API result: `{"success":true}`.
   - 2026-06-04 pre-credential recheck: current production POST still returns `502` with fallback JSON, matching the known Gmail SMTP credential blocker.

### P1

1. No required P1 remains unless new visual/content changes are made.
2. If the admin page is used again, recheck production portfolio data and rebuild/restart if static HTML must reflect it immediately.

### P2

1. Optional Claude Sonnet review for final wording/UI skim.
2. Optional README note after SMTP is fully working.

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
- `docs/NEXT_CHAT_HANDOFF.md`
- `docs/TASKS.md`

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

## Ready-To-Send Next Prompt

```text
프로젝트 루트:
cd /Users/juyoung/Desktop/My_Site

목표:
포트폴리오 사이트의 마지막 P0인 Gmail SMTP 인증 문제를 해결하고 운영 연락 폼 전송 성공을 확인한다.

현재 상태:
- 운영 사이트: https://juyoung-portfolio.duckdns.org
- GitHub: https://github.com/FutureAria/my_site
- 대표 프로젝트/모바일/라이트 테마/404/데모 링크/MajorLink GitHub 반영은 완료됨.
- MajorLink repo 링크: https://github.com/FutureAria/Major.git
- 연락 이메일, CONTACT_TO, SMTP_USER는 juwwkd89@gmail.com으로 확인됨.
- 현재 SMTP 실패 원인: Gmail `EAUTH` / `535 BadCredentials`.
- 실패 시 방문자에게 직접 이메일 fallback 버튼은 표시됨.

먼저 실행:
pwd
ls
git status --short --branch

먼저 읽을 파일:
README.md
DEPLOY_LOG.md
docs/TASKS.md
docs/NEXT_CHAT_HANDOFF.md
app/api/contact/route.ts
components/Contact.tsx
scripts/oracle-env.mjs

해야 할 일:
1. 사용자가 새 Gmail 앱 비밀번호 또는 새 SMTP credential을 준비했는지 확인한다.
2. credential 값은 출력하거나 Git에 저장하지 않는다.
3. Oracle 서버 `.env.local`의 `SMTP_PASS` 또는 필요한 SMTP 값을 교체한다.
4. `my-site.service`를 재시작한다.
5. 운영 `POST /api/contact`가 `{"success":true}`를 반환하는지 확인한다.
6. 받은 편지함에 QA 메일 도착 여부를 사용자에게 확인받는다.
7. DEPLOY_LOG.md와 docs/TASKS.md를 갱신한다.
8. 필요한 경우 npm run build, git commit/push, npm run deploy:oracle, npm run check:oracle을 실행한다.

주의:
- .env.local, .env.oracle, SMTP password/app password, admin password, SSH key, DuckDNS token, Oracle credential은 절대 커밋하지 않는다.
- public/uploads 기존 서버 업로드는 덮어쓰거나 삭제하지 않는다.
- 실행하지 않은 검증은 했다고 말하지 않는다.
```
