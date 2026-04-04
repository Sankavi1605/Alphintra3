const fs = require('fs');
let c = fs.readFileSync('app/src/index.html', 'utf8');

c = c.replace(/top: 20%;/g, 'top: 45%;');
c = c.replace(/transform: translateY\(0\);/g, 'transform: translateY(-50%);');

// For the footer, they want it lower... Maybe let's lessen the padding to make it less tall. And make `bottom: 0px` to be maybe just sticking out? Wait, if they want to scroll down to it... we can't scroll in 3d mode. What if `left: 0; width: 100vw; bottom: 0`. We can add a bit of padding-bottom to the card to not cover the footer, or we can scale down the footer.
// Let's drop padding to 15px 40px
let footerRegex = /padding: 30px 40px 20px;/g;
if (c.match(footerRegex)) {
    c = c.replace(footerRegex, 'padding: 20px 40px 10px;');
}

// Let's also move the END TITLE up so it's not hidden by the card that's now in the middle.
// We can add a custom css rule for it in the inline style tag.
let styleTagEnd = c.indexOf('</style>');
let insertCSS = `
      html.mode-3d .heads__section--end.active-3d-card .end__title {
        top: 20% !important;
        transform: translateY(0) !important;
      }
`;
if (c.indexOf('.end__title') === -1 || true) {
    c = c.substring(0, styleTagEnd) + insertCSS + c.substring(styleTagEnd);
}

fs.writeFileSync('app/src/index.html', c);
console.log('Done positioning.');

