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

// Remove footer from original postion
c = c.substring(0, idx - 10) + c.substring(blockEnd);

// Now locate the closing tag of heads__section--end
// Email: contact@alphintra.com </p>
let emailStr = 'Email: contact@alphintra.com </p>';
let emailIdx = c.indexOf(emailStr);

let endDivs = '\n            </div>\n          </div>\n        </div>';
let insertionPoint = c.indexOf(endDivs, emailIdx);
if (insertionPoint !== -1) {
    let finalIdx = insertionPoint + endDivs.length - 6; // before the last </div>
    
    c = c.substring(0, finalIdx) + '\n\n        ' + footerText.trim() + '\n\n        ' + c.substring(finalIdx);
    
    fs.writeFileSync('app/src/index.html', c);
    console.log('Successfully moved footer inside heads__section--end');
} else {
    console.log('Failed to find insertion point. Maybe space mismatches.');
}