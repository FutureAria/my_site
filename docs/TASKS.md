# Portfolio Site Tasks

Last updated: 2026-06-01 00:47 KST

## P0

- [ ] Reissue or replace the SMTP credential for the contact form.
  - Current production status: Oracle runtime has the SMTP key names configured.
  - Current blocker: Gmail SMTP rejects authentication with `EAUTH` / `535 BadCredentials`.
  - Security rule: do not commit or paste SMTP password, app password, DuckDNS token, Oracle key, or admin password into Git.
- [ ] Rerun production contact-form verification after the credential is replaced.
  - Expected success check: `POST https://juyoung-portfolio.duckdns.org/api/contact` returns `{"success":true}`.
  - Current fallback check: failed sends return a JSON error and show a direct email action in the form.

## P1

- [ ] Final mobile QA after SMTP credential replacement.
  - Home first screen.
  - BASE CHAIN detail page.
  - KIS AI Trader detail page.
  - MajorLink detail page.
  - Contact form success and failure states.
- [ ] Final light/dark theme QA.
  - Check CTA contrast, badges, project cards, detail first screen, and contact error state.
- [ ] Confirm production portfolio data after any admin edits.
  - KIS AI Trader remains framed as a personal project.
  - BASE CHAIN describes Toss Payments as MOCK/test flow.
  - MajorLink remains framed as ongoing MVP scope validation.

## P2

- [ ] Ask Claude Sonnet for a final portfolio wording/UI skim if more polish is wanted.
- [ ] Add a short README section for current demo status after contact form SMTP is fully working.
