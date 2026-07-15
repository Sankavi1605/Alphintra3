const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/src/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match `<div class="tails__tags">...</div>`
const regex = /<div class="tails__tags">([\s\S]*?)<\/div>/g;

let match;
let newContent = content;
let replacements = [];

while ((match = regex.exec(content)) !== null) {
  // Check if it's the "About Alphintra" card.
  // The "About Alphintra" card has its tags around line 2628. We can look for the text
  // "TECHNICAL FOUNDATIONS" which is inside the About Alphintra tags.
  // Wait, the "About Alphintra" tags are:
  // <span class="tails__tag"> TECHNICAL FOUNDATIONS </span>
  if (match[1].includes('TECHNICAL FOUNDATIONS')) {
    console.log('Skipping About Alphintra tags');
    continue;
  }
  
  // Comment out the entire div
  const originalBlock = match[0];
  const commentedBlock = `<!-- ${originalBlock} -->`;
  replacements.push({ original: originalBlock, commented: commentedBlock });
}

for (let r of replacements) {
  newContent = newContent.replace(r.original, r.commented);
}

fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Commented out ${replacements.length} tag blocks.`);
