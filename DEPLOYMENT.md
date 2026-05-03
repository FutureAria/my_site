# Deployment Notes

## Environment Variables

Set these values before deployment.

```bash
ADMIN_PASSWORD=use-a-long-private-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Image Uploads

The current admin upload flow stores files in `public/uploads`. This is comfortable for local editing and a personal desktop workflow.

For Vercel or other serverless hosting, uploaded files will not persist permanently after redeploys. Use one of these options before production:

- Keep editing locally, commit the generated files in `public/uploads`, then deploy.
- Move uploads to persistent storage such as S3, Cloudflare R2, Supabase Storage, or Vercel Blob.

## Recommended First Deployment Path

For this portfolio, the simplest stable path is:

1. Edit content locally in `/admin`.
2. Upload and arrange images locally.
3. Run `npm run build` and `npm run check:site`.
4. Deploy the whole project with the `public/uploads` files included.

This keeps the first release simple. Add external storage later only if you need to keep uploading files from the deployed admin page.

## Admin Password

Set `ADMIN_PASSWORD` in `.env.local` for local work and in the hosting dashboard for production. Do not commit real passwords to GitHub.

## Before Publishing

Run these checks.

```bash
npm run build
npm run check:content
npm run check:links
npm run dev -- --port 3000
npm run check:site
```

You can also run the combined check after the local server is already running.

```bash
npm run check:all
```

Then verify:

- `/`
- `/about`
- `/projects`
- `/projects/0`
- `/journal`
- `/contact`
- `/admin`
- `/sitemap.xml`
- `/robots.txt`

## Final Visual Pass

Before sharing the link, check these screens in both light and dark mode:

- Home hero: headline, note, and image collage should not overlap.
- Projects: search and filter should stay easy to use on mobile.
- Project detail: image records should open clearly and not feel like a random dump.
- About: the large title should wrap intentionally, not like broken text.
- Contact: resume, cover letter, GitHub, Notion, and email links should open correctly.

## Resume And Cover Letter

The admin page can upload both resume and cover letter PDFs. They are stored as paths under `hero.resumeFile` and `hero.coverLetterFile` in `data/portfolio.json`, then displayed on the Contact page as download links.

Only upload files you are comfortable sharing publicly. If the cover letter includes a phone number, address, private project details, or company-specific wording, make a public-safe PDF before attaching it.
