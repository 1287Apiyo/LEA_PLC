import fs from 'fs';
const data = fs.readFileSync('crs-computer.js', 'utf-8');
const re = /id: "(bc-\d)"[\s\S]*?notes: "([\s\S]*?)(?:"\s*$)/gm;
let m;
while ((m = re.exec(data)) !== null) {
  const wc = m[2].split(/\s+/).filter(w => w.length).length;
  console.log(m[1] + ': ' + wc + ' words');
}
