const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

const targetStr = `Email: contact@alphintra.com </p>
            </div>
          </div>
        </div>`;

let idx = c.indexOf('Email: contact@alphintra.com');
if (idx !== -1) {
    console.log('Found contact email string!');
    
    const footerRegex = /\s*<!-- NEW GRAY FULL WIDTH FOOTER -->[\s\S]*?&copy; 2024 Alphintra\. All rights reserved\.\n\s*<\/div>\n\s*<\/div>/;
    let match = c.match(footerRegex);
    if (match) {
        let footerText = match[0];
        console.log('Found footer!');
        c = c.replace(footerRegex, '');
        
        // Find the boundary
        let endOfSectionIdx = c.indexOf(targetStr) + targetStr.length - '</div>'.length;
        
        c = c.slice(0, endOfSectionIdx) + footerText + '\n        ' + c.slice(endOfSectionIdx);
        fs.writeFileSync('app/src/index.html', c);
        console.log('Fixed!');
    } else {
        console.log('Footer not found!');
    }
} else {
    console.log('Contact email not found!');
}