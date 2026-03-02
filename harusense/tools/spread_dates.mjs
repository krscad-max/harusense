import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import crypto from 'node:crypto';

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

function parseTags(fm){
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s)=>s.trim()).filter(Boolean);
}

function hashToInt(s){
  const h = crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
  return parseInt(h, 16);
}

const today = new Date('2026-03-02T00:00:00-07:00');
const maxDaysBack = 75; // spread across ~2.5 months

const files = readdirSync(postsDir).filter(f=>f.endsWith('.md')).sort();
let changed = 0;

for (const f of files){
  const full = join(postsDir, f);
  const md = readFileSync(full,'utf8');
  const p = split(md);
  if (!p) continue;

  const tags = parseTags(p.fm);

  // deterministic day offset by filename
  let offset = hashToInt(f) % maxDaysBack;
  // Bias: language posts skew recent
  if (tags.includes('english') || tags.includes('japanese')) offset = hashToInt('lang:'+f) % 25;
  // Japan travel posts skew medium recent
  if (tags.includes('japan') || tags.includes('travel')) offset = 10 + (hashToInt('jp:'+f) % 35);

  const d = new Date(today.getTime() - (offset + 1) * 24*60*60*1000); // ensure before today
  const iso = d.toISOString().slice(0,10);

  let fm = p.fm;
  fm = setField(fm, 'date', iso);

  const out = fm + p.body.trimStart();
  if (out !== md){
    writeFileSync(full, out, 'utf8');
    changed++;
  }
}

console.log(`Spread dates for ${changed} posts (all before 2026-03-02).`);
