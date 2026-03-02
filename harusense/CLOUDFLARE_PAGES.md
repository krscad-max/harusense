# Cloudflare Pages 배포 (HaruSense / Astro)

## 1) GitHub에 push
이 폴더(`harusense/`)가 GitHub 레포에 올라가 있어야 합니다.

## 2) Cloudflare Pages에서 프로젝트 생성
- Cloudflare Dashboard → **Workers & Pages** → **Pages** → *Create a project*
- GitHub 연결 후 레포 선택

## 3) Build 설정
- Framework preset: **Astro** (없으면 Custom)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: (레포 루트에 `harusense/`가 있다면) `harusense`

## 4) 환경 변수
기본은 필요 없음.

## 5) 커스텀 도메인
도메인 없으면 우선 `*.pages.dev`로 운영 가능.
도메인을 붙이면:
1) Pages 프로젝트 → **Custom domains** → 도메인 추가
2) DNS 안내 따라 설정
3) `astro.config.mjs`의 `site`를 실제 도메인으로 업데이트
   - 예: `https://harusense.com`
4) `public/robots.txt`의 Sitemap URL도 함께 변경

## 6) RSS/Sitemap
- RSS: `/rss.xml`
- Sitemap: `/sitemap-index.xml` (sitemap integration)
