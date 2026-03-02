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
  const jp = ['/images/japan/jp1.jpg','/images/japan/jp2.jpg','/images/japan/jp3.jpg','/images/japan/jp4.jpg','/images/japan/jp5.jpg','/images/japan/jp6.jpg','/images/japan/jp7.jpg','/images/japan/jp8.jpg','/images/japan/jp9.jpg','/images/japan/jp10.jpg','/images/japan/jp11.jpg','/images/japan/jp12.jpg'];
  const bright = ['/images/unsplash2/b1.jpg','/images/unsplash2/b2.jpg','/images/unsplash2/b3.jpg','/images/unsplash2/b4.jpg','/images/unsplash2/b5.jpg','/images/unsplash2/b6.jpg','/images/unsplash2/b7.jpg','/images/unsplash2/b8.jpg','/images/unsplash2/b9.jpg','/images/unsplash2/b10.jpg'];

  if (has('japanese') || has('travel') || has('restaurant') || has('station') || has('hotel') || has('convenience')) {
    return [jp[0], jp[3]];
  }
  if (has('kitchen')) return [bright[5], bright[0]];
  if (has('organization')) return [bright[3], bright[6]];
  if (has('budgeting') || has('bank')) return [bright[9], bright[8]];
  if (has('saving')) return [bright[1], bright[4]];
  if (has('consumption')) return [bright[2], bright[7]];
  if (has('english') || has('work') || has('phone') || has('airport') || has('hospital') || has('rent')) return [bright[7], bright[9]];
  return [bright[8], bright[0]];
}

function replaceFirstTwoInline(body, imgs){
  const re = /!\[]\((\/images\/(unsplash|unsplash2|japan)\/[^\)]+)\)/g;
  const matches = [...body.matchAll(re)];
  if (matches.length < 1) return body;

  // Replace first two image markdown occurrences only.
  let count = 0;
  return body.replace(re, () => {
    const img = imgs[Math.min(count, imgs.length - 1)];
    count++;
    return `![](${img})`;
  });
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
