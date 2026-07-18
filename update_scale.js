const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('Section.js'));

files.forEach(filename => {
  const filePath = path.join(sectionsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const sectionName = filename.replace('.js', '');

  // If the file already has updateTextPosition
  if (content.includes('function updateTextPosition')) {
    // Inject the dynamic scale at the top of updateTextPosition
    const injection = `  var _s = Math.max(0.4, Math.min(1, window.innerWidth / 1920));\n  text.el.scale.set(_s, _s, _s);\n`;
    
    // Check if we haven't already injected it
    if (!content.includes('Math.max(0.4')) {
      content = content.replace(/(function updateTextPosition\s*\(\)\s*\{)/, "$1\n" + injection);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ' + filename);
});
