Cloudflare Pages Deployment Guide (Astro)

1. Prerequisites
- GitHub account
- Cloudflare account
- Node.js (18+) installed locally

2. Local scaffold (recommend Astro)
- npm init astro@latest
- Choose 'minimal' or 'blog' template
- Project structure: src/pages, src/components, public/

3. Build scripts (package.json)
- "dev": "astro dev"
- "build": "astro build"
- "preview": "astro preview"

4. GitHub
- Create new repo (e.g., harusense)
- git init; git add .; git commit -m "Initial scaffold"; git push origin main

5. Cloudflare Pages
- Pages -> Create a project -> Connect to GitHub -> Select repo
- Framework: Astro; Build command: npm run build; Build output directory: dist
- Deploy. After first deploy, set custom domain when ready.

6. Post-deploy
- Check Lighthouse scores (mobile). Optimize images to WebP and enable caching.
- Add analytics and set up email form provider if needed.

Notes: If you prefer Next.js SSG, build output dir is out/ (next export). Adjust accordingly.
