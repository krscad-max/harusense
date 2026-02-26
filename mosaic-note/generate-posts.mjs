import fs from 'fs';
import path from 'path';
const postsDir = path.resolve('./posts');
const outFile = path.resolve('./posts.json');
if(!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, {recursive:true});
const files = fs.readdirSync(postsDir).filter(f=>f.endsWith('.md'));
const posts = files.map(f=>{
  const src = fs.readFileSync(path.join(postsDir,f),'utf8');
  const m = /^---([\s\S]*?)---/m.exec(src);
  const meta = {};
  if(m){
    m[1].split('\n').forEach(line=>{
      const [k,...rest]=line.split(':');
      if(!k) return;
      meta[k.trim()] = rest.join(':').trim();
    });
  }
  const id = meta.id || path.basename(f, '.md');
  return { id, title: meta.title||'', date: meta.date||'', tag: meta.tag||'', thumbnail: meta.thumbnail||'', desc: meta.desc||'', file: f };
});
// check duplicates
const ids = posts.map(p=>p.id);
const dup = ids.find((x,i)=>ids.indexOf(x)!==i);
if(dup){ console.error('Duplicate id',dup); process.exit(2); }
posts.sort((a,b)=> (b.date||'').localeCompare(a.date||''));
fs.writeFileSync(outFile, JSON.stringify(posts, null, 2),'utf8');
console.log('posts.json written', outFile);