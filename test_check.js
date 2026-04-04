const fs = require('fs');
const content = fs.readFileSync('app/src/index.html', 'utf8');
const idx = content.indexOf("stack.addEventListener('pointerdown', function (event) {");
console.log(content.substring(idx, idx + 200));
console.log("===============================");
const idx2 = content.indexOf("detailBackButtons[b].addEventListener('click', function () {");
console.log(content.substring(idx2 - 100, idx2 + 200));