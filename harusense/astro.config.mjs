import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 도메인 없을 때는 임시값으로 두고, Cloudflare Pages에 커스텀 도메인 붙일 때 실제 도메인으로 변경하세요.
  site: 'https://padoharu.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
