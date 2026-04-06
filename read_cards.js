const fs = require('fs');
const content = fs.readFileSync('app/src/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if(l.includes('data-work-card')) {
        console.log(i + ': ' + l.trim());
    }
});
