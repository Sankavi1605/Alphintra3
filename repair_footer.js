const fs = require('fs');
const glob = require('glob');

const files = glob.sync('{*.html,app/src/*.html}');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let o = c;

  // Change "Alphintra" gradient to white text
  const regexAlphintra = /<span style="background:\s*linear-gradient[^>]+>Alphintra<\/span>/g;
  c = c.replace(regexAlphintra, '<span style="color: #ffffff;">Alphintra</span>');

  // Change font-family
  c = c.replace(/font-family:\s*sans-serif;/g, "font-family: inherit;");

  // Bump up font sizes roughly 3px-6px bigger across the board
  c = c.replace(/font-size:\s*12px;/g, 'font-size: 15px;');
  c = c.replace(/font-size:\s*13px;/g, 'font-size: 15px;');
  c = c.replace(/font-size:\s*14px;/g, 'font-size: 18px;');
  c = c.replace(/font-size:\s*18px;/g, 'font-size: 24px;');

  if (o !== c) {
    fs.writeFileSync(f, c);
    console.log('Updated style in: ' + f);
  }
});
