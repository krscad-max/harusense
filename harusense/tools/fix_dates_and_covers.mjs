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

function setField(fm, key, value){
  const re = new RegExp(`^${key}:.*$`, 'm');
  const line = `${key}: ${value}`;
  if (re.test(fm)) return fm.replace(re, line);
  const idx = fm.lastIndexOf('---');
  const head = fm.slice(0, idx).trimEnd();
  const tail = fm.slice(idx);
  return head + `\n${line}\n` + tail;
}

function setQuoted(fm, key, value){
  const re = new RegExp(`^${key}:.*$`, 'm');
  const line = `${key}: "${value}"`;
  if (re.test(fm)) return fm.replace(re, line);
  const idx = fm.lastIndexOf('---');
  const head = fm.slice(0, idx).trimEnd();
  const tail = fm.slice(idx);
  return head + `\n${line}\n` + tail;
}

function parseTags(fm){
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s)=>s.trim()).filter(Boolean);
}

function pickCover(tags){
  const has = (t)=>tags.includes(t);
  const bright = ['/images/unsplash2/b1.jpg','/images/unsplash2/b2.jpg','/images/unsplash2/b3.jpg','/images/unsplash2/b4.jpg','/images/unsplash2/b5.jpg','/images/unsplash2/b6.jpg','/images/unsplash2/b7.jpg','/images/unsplash2/b8.jpg','/images/unsplash2/b9.jpg','/images/unsplash2/b10.jpg'];
  const jp = ['/images/japan/jp1.jpg','/images/japan/jp2.jpg','/images/japan/jp3.jpg','/images/japan/jp4.jpg','/images/japan/jp5.jpg','/images/japan/jp6.jpg','/images/japan/jp7.jpg','/images/japan/jp8.jpg','/images/japan/jp9.jpg','/images/japan/jp10.jpg','/images/japan/jp11.jpg','/images/japan/jp12.jpg'];

  if (has('japan') || has('japanese') || has('travel') || has('restaurant') || has('station') || has('hotel') || has('convenience')) return jp[tags.length % jp.length];
  if (has('english') || has('phone') || has('work') || has('rent') || has('bank') || has('hospital') || has('airport')) return bright[7];
  if (has('kitchen')) return bright[5];
  if (has('organization')) return bright[3];
  if (has('saving')) return bright[1];
  if (has('budgeting')) return bright[9];
  return bright[0];
}

const TODAY = new Date('2026-03-02T00:00:00-07:00'); // MST-ish
const MAX_DATE = new Date(TODAY.getTime() - 24*60*60*1000); // yesterday
const maxDateStr = '2026-03-01';

const files = readdirSync(postsDir).filter((f)=>f.endsWith('.md')).sort();
let changed = 0;

for (let i=0;i<files.length;i++){
  const f = files[i];
  const full = join(postsDir, f);
  const md = readFileSync(full,'utf8');
  const p = split(md);
  if (!p) continue;

  let fm = p.fm;

  // Force all dates to <= 2026-03-01
  fm = setField(fm, 'date', maxDateStr);

  // Update cover per tags
  const tags = parseTags(fm);
  const cover = pickCover(tags);
  fm = setQuoted(fm, 'coverImage', cover);
  fm = setQuoted(fm, 'coverCredit', 'Unsplash');
  fm = setQuoted(fm, 'coverCreditUrl', 'https://unsplash.com');

  const out = fm + p.body.trimStart();
  if (out !== md){
    writeFileSync(full, out, 'utf8');
    changed++;
  }
}

console.log(`Fixed dates (<=${maxDateStr}) and aligned covers for ${changed} posts.`);
