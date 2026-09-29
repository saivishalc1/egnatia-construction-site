# Egnatia Construction website

One-page, bilingual (EN/ES) site for Egnatia Construction Inc., a Brooklyn general contractor.
Built with Vite, React, TypeScript, Tailwind CSS v4, Motion and Lenis.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npx vite preview
```

Every push to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Before launch

- Replace stock photos/footage with the client's own project media (work gallery must be real projects).
- Confirm estimator rates (`src/data.ts`), FAQ answers and Spanish copy with the client.
- Connect the contact form (it currently only shows a success message).
- Remove `noindex` from `index.html` and `public/robots.txt`, and set an absolute `og:image` URL.

Stock media: Pexels and Unsplash (free for commercial use).
