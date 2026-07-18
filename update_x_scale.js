const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('Section.js'));

files.forEach(filename => {
  const filePath = path.join(sectionsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all text.el.position.x = NUMBER; with a dynamic scaling version
  // We only replace if it's a literal number.
  // We also make sure we don't double replace.
  if (!content.includes('window.innerWidth / (window.innerWidth')) {
    content = content.replace(/text\.el\.position\.x\s*=\s*([-]?\d+(?:\.\d+)?);/g, 
      "text.el.position.x = $1 * (window.innerWidth / (window.innerWidth <= 900 ? 900 : 1920));");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Processed X scaling for ' + filename);
  }
});
