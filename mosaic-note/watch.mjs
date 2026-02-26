import fs from 'fs';
import {exec} from 'child_process';
const chokidar = null;
console.log('Simple watch: polling every 2s (no chokidar)');
let last = {};
function snapshot(){
  const p = fs.readdirSync('./posts').filter(f=>f.endsWith('.md'));
  const l = fs.existsSync('./links.csv') ? fs.readFileSync('./links.csv','utf8') : '';
  return {p: p.join('|'), l};
}
if(!fs.existsSync('./posts')) fs.mkdirSync('./posts', {recursive:true});
last = snapshot();
setInterval(()=>{
  const s = snapshot();
  if(s.p !== last.p || s.l !== last.l){
    console.log('Change detected. Running build:all');
    const child = exec('node validate-links-csv.mjs && node generate-links.mjs && node generate-posts.mjs && node validate.mjs');
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    last = s;
  }
},2000);
