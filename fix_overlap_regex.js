const fs = require('fs');

let content = fs.readFileSync('app/src/index.html', 'utf8');

// 1. Fix buttons being merged
content = content.replace(
    /(\.tails__card-actions\s*\{\s*margin-top:\s*20px;\s*\})/g,
    '.tails__card-actions {\n      margin-top: 20px;\n      display: flex;\n      flex-wrap: wrap;\n      gap: 15px;\n    }'
);

// 2. Fix the card "Let's Build Something Meaningful" overlapping the footer
// Desktop fix: move it up slightly by changing top and transform
content = content.replace(
    /top:\s*36%;\s*width:\s*min\(520px,\s*38vw\);\s*transform:\s*translateY\(-50%\);/g,
    'top: 20%;\n        width: min(520px, 38vw);\n        transform: translateY(0%);'
);

// Mobile fix
content = content.replace(
    /html\.mode-3d \.heads__section--neons\.active-3d-card \.section__card--neons-right\.is-mobile-active\s*\{\s*display:\s*block;\s*\}/g,
    `html.mode-3d .heads__section--neons.active-3d-card .section__card--neons-right.is-mobile-active {
        display: block;
      }

      html.mode-3d .heads__section--end.active-3d-card .section__card {
        bottom: calc(env(safe-area-inset-bottom, 0px) + 400px) !important;
      }`
);

fs.writeFileSync('app/src/index.html', content);
console.log('Fixed buttons and layout overlaps for the end section via regex.');