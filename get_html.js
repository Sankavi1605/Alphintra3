const fs = require('fs');
let html = fs.readFileSync('app/src/index.html', 'utf-8');
const i1 = html.indexOf('heads__section--end');
console.log(html.substring(i1 - 20, i1 + 2500));
