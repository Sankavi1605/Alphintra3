const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

// The footer block that might be at the end, or outside
const footerRegex = /<!-- NEW GRAY FULL WIDTH FOOTER -->[\s\S]*?&copy; 2024 Alphintra\. All rights reserved\.\n\s*<\/div>\n\s*<\/div>/;
const match = c.match(footerRegex);
if (match) {
    let footerObj = match[0];
    c = c.replace(footerRegex, '');
    
    // Ensure it is absolute for 3D layout integration
    footerObj = footerObj.replace(/position:\s*relative;/, 'position: absolute;');
    if (footerObj.indexOf('bottom:') === -1) {
        // give it bottom 0
        footerObj = footerObj.replace('left: 0', 'bottom: 0px; left: 0');
    }
    
    // Decrease the height/padding of the footer somewhat so it takes less vertical space on short screens
    footerObj = footerObj.replace('padding: 60px 40px;', 'padding: 30px 40px 20px;');
    footerObj = footerObj.replace('gap: 40px;', 'gap: 20px;');
    footerObj = footerObj.replace('margin-bottom: 20px;', 'margin-bottom: 10px;');
    footerObj = footerObj.replace('margin: 60px auto 0;', 'margin: 30px auto 0;');
    
    // Now insert it back inside the section__card container's parent -> class="heads__section heads__section--end"
    // The end of that section is right before <div class="part part--stars"></div>
    const insertPoint = '<div class="part part--stars"></div>';
    if (c.indexOf(insertPoint) !== -1) {
        c = c.replace(insertPoint, footerObj + '\n          ' + insertPoint);
        console.log('Footer moved back into heads__section--end');
    } else {
        console.log('Could not find insertion point.');
    }
    
    // Now we must fix the CSS of the card to raise it up so they don't overlap!
    // Search for: html.mode-3d .heads__section--end.active-3d-card .section__card
    // Replace `top: 72%;` with `top: 25%;`
    // Wait, earlier I might have changed it to `top: 40%;`
    c = c.replace(/top:\s*72%;/g, 'top: 20%;');
    c = c.replace(/top:\s*40%;/g, 'top: 20%;'); // In case my previous script left it at 40%
    
    // Also remove transform: translateY(-50%) so it originates from 20% down
    c = c.replace(/transform:\s*translateY\(-50%\);/g, 'transform: translateY(0);');
    
    fs.writeFileSync('app/src/index.html', c);
    console.log('Done!');
} else {
    console.log('Footer regex failed.');
}
