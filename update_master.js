const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const sections = {
  'ballSection.js': { x: 15, y: 0, z: 15, rotX: 0, rotY: -0.4, align: 'left' },
  'beamsSection.js': { x: -10, y: 8, z: 0, rotX: 0, rotY: 0, align: 'right' },
  'dropSection.js': { x: -10, y: 8, z: 0, rotX: 0, rotY: 0, align: 'right' },
  'endSection.js': { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, align: 'center' },
  'faceSection.js': { x: 26, y: 0, z: 0, rotX: 0, rotY: -0.4, align: 'left' },
  'flowSection.js': { x: 0, y: 0, z: -10, rotX: 0, rotY: 0.4, align: 'center' },
  'galaxySection.js': { x: 0, y: 20, z: -20, rotX: 0, rotY: 0, align: 'center' },
  'heightSection.js': { x: -20, y: 0, z: 0, rotX: 0, rotY: 0, align: 'right' },
  'rocksSection.js': { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, align: 'center' },
  'waveSection.js': { x: 0, y: 10, z: 0, rotX: 0.2, rotY: 0, align: 'center' }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  
  const sectionName = filename.replace('.js', '');
  const mobileX = pos.align === 'left' ? -8 : (pos.align === 'right' ? 8 : 0);

  const newBlock = `function updateTextPosition () {
  var w = window.innerWidth;
  var s = (w <= 900) ? Math.max(0.6, w / 1200) : Math.max(0.7, Math.min(1.0, w / 1600));
  text.el.scale.set(s, s, s);

  if (w <= 900) {
    text.el.position.x = ${mobileX};
    text.el.position.y = 25;
    text.el.position.z = ${pos.z};
    text.el.rotation.x = 0;
    text.el.rotation.y = 0;
  } else {
    text.el.position.x = ${pos.x};
    text.el.position.y = ${pos.y};
    text.el.position.z = ${pos.z};
    text.el.rotation.x = ${pos.rotX};
    text.el.rotation.y = ${pos.rotY};
  }
}
updateTextPosition();
window.addEventListener('resize', updateTextPosition);`;

  const regex = /function\s+updateTextPosition\s*\(\)\s*\{[\s\S]*?window\.addEventListener\('resize',\s*updateTextPosition\);/;
  
  if (regex.test(content)) {
    // File had updateTextPosition, replace it
    content = content.replace(regex, newBlock);
  } else {
    // File didn't have it, insert before add(text.el)
    // First, remove any original fixed positions
    content = content.replace(/text\.el\.position\.set\([^)]+\);/g, '');
    content = content.replace(/text\.el\.position\.x\s*=[^;]+;/g, '');
    content = content.replace(/text\.el\.position\.y\s*=[^;]+;/g, '');
    content = content.replace(/text\.el\.position\.z\s*=[^;]+;/g, '');
    content = content.replace(/text\.el\.rotation\.x\s*=[^;]+;/g, '');
    content = content.replace(/text\.el\.rotation\.y\s*=[^;]+;/g, '');
    content = content.replace(/text\.el\.rotation\.z\s*=[^;]+;/g, '');
    
    const addRegex = new RegExp(sectionName + '\\.add\\(text\\.el\\);');
    if (addRegex.test(content)) {
      content = content.replace(addRegex, newBlock + '\n' + sectionName + '.add(text.el);');
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ' + filename);
}
