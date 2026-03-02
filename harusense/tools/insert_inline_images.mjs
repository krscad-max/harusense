import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

const images = [
  '/images/unsplash/u1.jpg','/images/unsplash/u2.jpg','/images/unsplash/u3.jpg','/images/unsplash/u4.jpg','/images/unsplash/u5.jpg',
  '/images/unsplash/u6.jpg','/images/unsplash/u7.jpg','/images/unsplash/u8.jpg','/images/unsplash/u9.jpg','/images/unsplash/u10.jpg',
];

function split(md){
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  return { fm: md.slice(0, end + 1), body: md.slice(end + 1) };
}

function alreadyHasInlineImages(body){
  return body.includes('![](/images/unsplash/') || body.includes('![](/images/post-');
}

function insertAfterFirstParagraph(body, img){
  const parts = body.trimStart().split(/\n\n+/);
  if (parts.length < 2) return body;
  // after first block
  parts.splice(1, 0, `![](${img})`);
  return parts.join('\n\n') + '\n';
}

function insertBeforeFaqOrEnd(body, img){
  const marker = '## 자주 묻는 질문(FAQ)';
  const idx = body.indexOf(marker);
  if (idx !== -1){
    const before = body.slice(0, idx).trimEnd();
    const after = body.slice(idx);
    return `${before}\n\n![](${img})\n\n${after}`;
  }
  return body.trimEnd() + `\n\n![](${img})\n`;
}

const files = readdirSync(postsDir).filter((f)=>f.endsWith('.md')).sort();
let changed = 0;
for (let i=0;i<files.length;i++){
  const f = files[i];
  const full = join(postsDir, f);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;
  if (alreadyHasInlineImages(p.body)) continue;

  const img1 = images[i % images.length];
  const img2 = images[(i + 3) % images.length];

  let body = p.body;
  body = insertAfterFirstParagraph(body, img1);
  body = insertBeforeFaqOrEnd(body, img2);

  writeFileSync(full, p.fm + body.trimStart(), 'utf8');
  changed++;
}

console.log(`Inserted inline images into ${changed} posts.`);
