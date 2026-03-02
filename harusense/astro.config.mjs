import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://harusense.example',
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
