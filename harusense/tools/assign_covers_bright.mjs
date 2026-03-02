import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

const pool = [
  { img: '/images/unsplash2/b1.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b2.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b3.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b4.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b5.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b6.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b7.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b8.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b9.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b10.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
];

function split(md) {
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  return { fm: md.slice(0, end + 1), body: md.slice(end + 1) };
}

function setField(fm, key, value) {
  const re = new RegExp(`^${key}:.*$`, 'm');
  const line = `${key}: "${value}"`;
  if (re.test(fm)) return fm.replace(re, line);
  const idx = fm.lastIndexOf('---');
  const head = fm.slice(0, idx).trimEnd();
  const tail = fm.slice(idx);
  return head + `\n${line}\n` + tail;
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md')).sort();
let i = 0;
for (const f of files) {
  const full = join(postsDir, f);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;
  const pick = pool[i % pool.length];
  let fm = p.fm;
  fm = setField(fm, 'coverImage', pick.img);
  fm = setField(fm, 'coverCredit', pick.credit);
  fm = setField(fm, 'coverCreditUrl', pick.url);
  writeFileSync(full, fm + p.body, 'utf8');
  i++;
}
console.log(`Assigned bright covers for ${i} posts.`);
