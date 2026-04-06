const fs = require('fs');
const content = fs.readFileSync('app/src/index.html', 'utf8');
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('data-work-card="2"'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('our-work-detail'));
console.log(lines.slice(startIdx-1, endIdx).join('\n'));
