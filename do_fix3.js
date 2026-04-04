const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

const footerRegex = /\s*<!-- NEW GRAY FULL WIDTH FOOTER -->[\s\S]*?&copy; 2024 Alphintra\. All rights reserved\.\n\s*<\/div>\n\s*<\/div>/;
let match = c.match(footerRegex);
if (!match) {
    console.log('Footer not found!');
    process.exit(1);
}

let footerText = match[0];
console.log('Found footer!');

// Remove footer
c = c.replace(footerRegex, '');

// Find the insertion point correctly
// Let's find: `<p class="tails__contact-email"> Email: contact@alphintra.com </p>`
// And then jump 3 `</div>` tags.
const regexEnd = /(<p class="tails__contact-email">\s*Email: contact@alphintra\.com\s*<\/p>\s*<\/div>\s*<\/div>\s*)<\/div>/;
let sectionMatch = c.match(regexEnd);

if (sectionMatch) {
    console.log('Found end of heads__section--end!');
    c = c.replace(regexEnd, sectionMatch[1] + '\n\n' + footerText + '\n        </div>');
    fs.writeFileSync('app/src/index.html', c);
    console.log('Fixed and saved!');
} else {
    console.log('Could not find the end of heads__section--end');
}