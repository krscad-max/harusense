import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

const pool = [
  { img: '/images/unsplash/u1.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u2.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u3.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u4.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u5.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u6.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u7.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u8.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u9.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash/u10.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
];

function setField(fm, key, value) {
  const re = new RegExp(`^${key}:.*$`, 'm');
  const line = `${key}: "${value}"`;
  if (re.test(fm)) return fm.replace(re, line);
  // insert before closing ---
  const idx = fm.lastIndexOf('---');
  if (idx === -1) return fm + `\n${line}\n`;
  const head = fm.slice(0, idx).trimEnd();
  const tail = fm.slice(idx);
  return head + `\n${line}\n` + tail;
}

function split(md) {
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  const fm = md.slice(0, end + 1);
  const body = md.slice(end + 1);
  return { fm, body };
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md')).sort();
let i = 0;
for (const f of files) {
  const full = join(postsDir, f);
  const md = readFileSync(full, 'utf8');
  const parts = split(md);
  if (!parts) continue;

  const p = pool[i % pool.length];
  let fm = parts.fm;
  fm = setField(fm, 'coverImage', p.img);
  fm = setField(fm, 'coverCredit', p.credit);
  fm = setField(fm, 'coverCreditUrl', p.url);

  writeFileSync(full, fm + parts.body, 'utf8');
  i++;
}

console.log(`Assigned covers for ${i} posts.`);
