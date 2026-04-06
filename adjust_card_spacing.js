const fs = require('fs');

let content = fs.readFileSync('app/src/index.html', 'utf8');

// The main mobile card overlay is currently bottom: 16px, which overlaps with the newly added footer. Let's bump it up.
content = content.replace(
    'bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);',
    'bottom: calc(env(safe-area-inset-bottom, 0px) + 80px);'
);

// Other sections like face and neons also have a 12px override for overlapping.
content = content.replace(
    /bottom: calc\(env\(safe-area-inset-bottom, 0px\) \+ 12px\);/g,
    'bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);'
);

fs.writeFileSync('app/src/index.html', content);
console.log('Mobile section card spacing updated!');
