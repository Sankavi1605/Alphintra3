const fs = require('fs');

let content = fs.readFileSync('app/src/index.html', 'utf8');

// 1. Fix buttons being merged
content = content.replace(
    '.tails__card-actions {\n      margin-top: 20px;\n    }',
    '.tails__card-actions {\n      margin-top: 20px;\n      display: flex;\n      flex-wrap: wrap;\n      gap: 15px;\n    }'
);

// 2. Fix the card "Let's Build Something Meaningful" overlapping the footer
// Desktop fix: move it up slightly by changing top and transform
const oldDesktopRule = `html.mode-3d .heads__section--end.active-3d-card .section__card {
        left: 7% !important;
        right: auto;
        top: 36%;
        width: min(520px, 38vw);
        transform: translateY(-50%);
      }`;
const newDesktopRule = `html.mode-3d .heads__section--end.active-3d-card .section__card {
        left: 7% !important;
        right: auto;
        top: 20%;
        width: min(520px, 38vw);
        transform: translateY(0%);
      }`;
content = content.replace(oldDesktopRule, newDesktopRule);

// Mobile fix: push the end card specifically HIGHER than 80px above the tall mobile footer. 
// We insert a rule into the max-width: 900px media query
const insertionPointStr = `html.mode-3d .heads__section--neons.active-3d-card .section__card--neons-right.is-mobile-active {
        display: block;
      }`;
const injectedMobileRule = `html.mode-3d .heads__section--neons.active-3d-card .section__card--neons-right.is-mobile-active {
        display: block;
      }

      html.mode-3d .heads__section--end.active-3d-card .section__card {
        bottom: calc(env(safe-area-inset-bottom, 0px) + 400px) !important;
      }`;

content = content.replace(insertionPointStr, injectedMobileRule);

fs.writeFileSync('app/src/index.html', content);
console.log('Fixed buttons and layout overlaps for the end section.');
