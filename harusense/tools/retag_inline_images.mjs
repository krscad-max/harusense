import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

function split(md){
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  return { fm: md.slice(0, end + 1), body: md.slice(end + 1) };
}

function parseTags(fm){
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s)=>s.trim()).filter(Boolean);
}

function pickImages(tags){
  const has = (t)=>tags.includes(t);
  // crude but better than random
  if (has('kitchen')) return ['/images/unsplash/u1.jpg','/images/unsplash/u6.jpg'];
  if (has('organization')) return ['/images/unsplash/u4.jpg','/images/unsplash/u7.jpg'];
  if (has('budgeting')) return ['/images/unsplash/u10.jpg','/images/unsplash/u9.jpg'];
  if (has('saving')) return ['/images/unsplash/u2.jpg','/images/unsplash/u5.jpg'];
  if (has('consumption')) return ['/images/unsplash/u3.jpg','/images/unsplash/u8.jpg'];
  if (has('productivity') || has('routine') || has('morning')) return ['/images/unsplash/u9.jpg','/images/unsplash/u3.jpg'];
  return ['/images/unsplash/u9.jpg','/images/unsplash/u10.jpg'];
}

function replaceFirstTwoInline(body, imgs){
  const re = /!\[]\(\/images\/unsplash\/u\d+\.jpg\)/g;
  const matches = [...body.matchAll(re)];
  if (matches.length < 1) return body;

  let out = body;
  // replace first
  out = out.replace(re, `![](${imgs[0]})`);
  // After first replacement, replace next occurrence (if any) with second image.
  const re2 = /!\[]\(\/images\/unsplash\/u\d+\.jpg\)/;
  const firstIdx = out.indexOf(`![](${imgs[0]})`);
  if (firstIdx !== -1) {
    const before = out.slice(0, firstIdx + `![](${imgs[0]})`.length);
    const after = out.slice(firstIdx + `![](${imgs[0]})`.length);
    const after2 = after.replace(re2, `![](${imgs[1]})`);
    out = before + after2;
  }
  return out;
}

const files = readdirSync(postsDir).filter((f)=>f.endsWith('.md'));
let changed = 0;
for (const f of files){
  const full = join(postsDir, f);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;
  const tags = parseTags(p.fm);
  const imgs = pickImages(tags);
  const newBody = replaceFirstTwoInline(p.body, imgs);
  if (newBody !== p.body){
    writeFileSync(full, p.fm + newBody.trimStart(), 'utf8');
    changed++;
  }
}
console.log(`Retagged inline images for ${changed} posts.`);
