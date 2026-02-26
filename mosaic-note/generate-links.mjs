import fs from 'fs';
import path from 'path';
const csvFile = path.resolve('./links.csv');
const outFile = path.resolve('./links.json');
if(!fs.existsSync(csvFile)){
  console.error('links.csv not found, creating sample');
  const sample = 'section_id,section_title,section_subtitle,section_badge,section_icon,section_priority,item_name,item_desc,item_url,item_phone,item_priority\nlinks,Useful Links,,,#,1,Example,An example link,https://example.com,,1\n';
  fs.writeFileSync(csvFile, sample,'utf8');
}
const csv = fs.readFileSync(csvFile,'utf8');
const lines = csv.split('\n').filter(Boolean);
const hdr = lines.shift().split(',').map(h=>h.trim());
const rows = lines.map(l=>{
  const cols = l.split(',');
  const obj = {};
  hdr.forEach((h,i)=>obj[h]= (cols[i]||'').trim());
  return obj;
});
const sections = {};
rows.forEach(r=>{
  const sid = r.section_id || 'default';
  sections[sid] = sections[sid] || { id: sid, title: r.section_title || sid, subtitle: r.section_subtitle || '', badge: r.section_badge || '', icon: r.section_icon || '', priority: Number(r.section_priority)||999, items: [] };
  sections[sid].items.push({ name: r.item_name, desc: r.item_desc, url: r.item_url, phone: r.item_phone, priority: Number(r.item_priority)||999 });
});
const out = Object.values(sections).map(s=>{
  s.items.sort((a,b)=> (a.priority||999)-(b.priority||999));
  return s;
});
out.sort((a,b)=> (a.priority||999)-(b.priority||999));
fs.writeFileSync(outFile, JSON.stringify(out, null, 2),'utf8');
console.log('links.json written', outFile);