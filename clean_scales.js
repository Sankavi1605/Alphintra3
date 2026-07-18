const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('Section.js'));

files.forEach(filename => {
  const filePath = path.join(sectionsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all text.el.scale.set(...) except the one with _s
  content = content.replace(/text\.el\.scale\.set\((?!_s)[^)]+\);/g, '');
  
  // Also, for ballSection.js specifically, let's adjust the desktop X base from 15 to 9 so it never clips even if scale is 1.
  if (filename === 'ballSection.js') {
    content = content.replace(/15 \* \(window\.innerWidth/g, '9 * (window.innerWidth');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned old scales in ' + filename);
});
