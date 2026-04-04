const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

// Identify footer boundaries precisely
let idx = c.indexOf('<!-- NEW GRAY FULL WIDTH FOOTER -->');
let blockEnd = c.indexOf('<div class="part part--stars"></div>');
if (idx === -1 || blockEnd === -1) {
    console.log('Footer bounds not found');
    process.exit(1);
}

// Extract footer
let footerText = c.substring(idx - 10, blockEnd);
c = c.substring(0, idx - 10) + c.substring(blockEnd);

// Now locate the contact email
let emailStr = 'Email: contact@alphintra.com </p>';
let emailIdx = c.indexOf(emailStr);

if (emailIdx !== -1) {
    // Starting from emailIdx, find the next 3 </div> tags
    let currentIdx = emailIdx;
    for (let i = 0; i < 3; i++) {
        currentIdx = c.indexOf('</div>', currentIdx + 6);
    }
    
    // Now `currentIdx` is the index of the 3rd </div>.
    // We want to insert the footer right before this 3rd </div> so it is inside the outer div.
    if (currentIdx !== -1) {
        c = c.substring(0, currentIdx) + '\n\n        ' + footerText.trim() + '\n\n        ' + c.substring(currentIdx);
        fs.writeFileSync('app/src/index.html', c);
        console.log('Successfully moved footer inside heads__section--end');
    }
}
