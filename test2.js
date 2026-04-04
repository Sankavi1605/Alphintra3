const fs = require('fs');
let html = fs.readFileSync('app/src/index.html', 'utf-8');

const regex = /<div class=\"part part--title[^\"]*\"[^>]*data-(\d+)=\"opacity:0\"[^>]*data-(\d+)=\"opacity:1\">[\s\S]*?(?=<div class=\"part section__card)/g;
let matches = [...html.matchAll(regex)];
matches.forEach(m => {
  console.log(m[0].substring(0, 100));
  console.log('---');
});
