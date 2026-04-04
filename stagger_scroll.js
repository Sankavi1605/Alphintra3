const fs = require('fs');
let html = fs.readFileSync('app/src/index.html', 'utf-8');

// Update titles (fade in early)
html = html.replace(/(<div[^>]*class=\"[^\"]*part--title[^\"]*\"[^>]*data-)(\d+)(=\"opacity:0\"[^>]*data-)(\d+)(=\"opacity:1\")/g, (match, p1, start, p3, end, p5) => {
    let s = parseInt(start);
    let e = parseInt(end);
    let mid = Math.floor(s + (e - s) * 0.4); 
    console.log('Title: ', s, '->', e, '=>', s, '->', mid);
    return p1 + s + p3 + mid + p5;
});

// Update cards (fade in late)
html = html.replace(/(<div[^>]*class=\"[^\"]*section__card[^\"]*\"[^>]*data-)(\d+)(=\"opacity:0\"[^>]*data-)(\d+)(=\"opacity:1\")/g, (match, p1, start, p3, end, p5) => {
    let s = parseInt(start);
    let e = parseInt(end);
    let mid = Math.floor(s + (e - s) * 0.4); 
    console.log('Card: ', s, '->', e, '=>', mid, '->', e);
    return p1 + mid + p3 + e + p5;
});

fs.writeFileSync('app/src/index.html', html, 'utf-8');
