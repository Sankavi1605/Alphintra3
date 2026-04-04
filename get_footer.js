const fs = require('fs');
let html = fs.readFileSync('app/src/index.html', 'utf-8');

// The footer block
const footerStartStr = '<div\n                  class="new-footer-wrap"';
const startIndex = html.indexOf('class="new-footer-wrap"');
console.log("Footer index:", startIndex);
if(startIndex > -1) {
  let sub = html.substring(startIndex - 50, startIndex + 300);
  console.log(sub);
}
