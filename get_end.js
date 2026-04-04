const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');
let idx = c.indexOf('<div class="heads__section heads__section--end">');
if (idx === -1) {
  console.log("NOT FOUND");
} else {
  console.log(c.substring(idx, idx + 2000));
}