import fs from 'fs';
const csvFile = './links.csv';
if(!fs.existsSync(csvFile)){ console.error('links.csv not found'); process.exit(2); }
const csv = fs.readFileSync(csvFile,'utf8');
const lines = csv.split('\n').filter(Boolean);
const hdr = lines.shift().split(',').map(h=>h.trim());
const problems = [];
lines.forEach((l,idx)=>{
  const cols = l.split(',');
  if(cols.length < hdr.length) problems.push({line: idx+2, msg:'missing cols'});
  const url = cols[8]||'';
  if(url && !/^https?:\/\//.test(url)) problems.push({line: idx+2, msg:'url must start with http/https'});
});
if(problems.length){ console.error('Validation failed', problems); process.exit(3); }
console.log('links.csv OK');