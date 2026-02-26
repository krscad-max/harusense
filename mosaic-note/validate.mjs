import fs from 'fs';
const postsFile = './posts.json';
const linksFile = './links.json';
let ok = true;
if(!fs.existsSync(postsFile)){ console.error('posts.json missing'); ok=false; }
else{
  const posts = JSON.parse(fs.readFileSync(postsFile,'utf8'));
  const ids = posts.map(p=>p.id);
  const dup = ids.find((x,i)=>ids.indexOf(x)!==i);
  if(dup){ console.error('duplicate post id',dup); ok=false; }
}
if(!fs.existsSync(linksFile)){ console.error('links.json missing'); ok=false; }
else{
  const links = JSON.parse(fs.readFileSync(linksFile,'utf8'));
  // basic url check
  const bad = [];
  (links||[]).forEach(s=> s.items.forEach(it=>{ if(it.url && !/^https?:\/\//.test(it.url)) bad.push(it); }));
  if(bad.length){ console.error('links.json contains invalid urls', bad); ok=false; }
}
if(!ok) process.exit(4);
console.log('validate OK');