const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

c = c.replace('top: 40%;', 'top: 72%;'); // Revert my previous test hack

const footerRegex = /<!-- NEW GRAY FULL WIDTH FOOTER -->\s*<div style="position: absolute;[\s\S]*?&copy; 2024 Alphintra\. All rights reserved\.\n\s*<\/div>\n\s*<\/div>/;
const match = c.match(footerRegex);
if (match) {
    let footerObj = match[0];
    c = c.replace(footerRegex, '');
    
    // Change style to relative and remove 'bottom: 0;' and 'left: 0;' and 'width: 100vw' 
    // it's better to just be inline width: 100%. Actually width: 100% is fine.
    // However, if the tails container doesn't block it, maybe we just put it after <div class="tails"></div>
    footerObj = footerObj.replace('position: absolute;', 'position: relative;');
    footerObj = footerObj.replace('bottom: 0;', '');
    
    // Let's insert it right after the closing of "page-content" or "outer-wrapper"
    const insertPoint = '<div class="tails"></div>\n  </div>';
    
    if (c.indexOf(insertPoint) !== -1) {
        c = c.replace(insertPoint, insertPoint + '\n\n' + footerObj);
        console.log('Moved footer to end of file!');
    } else {
        const altPoint = '<div class="tails"></div>';
        if (c.indexOf(altPoint) !== -1) {
            c = c.replace(altPoint, altPoint + '\n\n  ' + footerObj);
            console.log('Moved footer below tails!');
        } else {
            console.log('Tails div not found.');
        }
    }
    
    fs.writeFileSync('app/src/index.html', c);
} else {
    console.log('Footer not found');
}
