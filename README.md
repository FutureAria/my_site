# Juyoung Portfolio

Personal portfolio website for projects, resume, blog-style records, skills, and contact information.

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

## Admin

The admin page uses an environment-based password and an httpOnly cookie. Write APIs are protected by middleware.

Never commit the real admin password.
