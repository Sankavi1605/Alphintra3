const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const sections = {
  'ballSection.js': { origX: 15, origY: 0, origZ: 15, origRotX: 0, origRotY: -0.4, align: 'left' },
  'beamsSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, align: 'right' },
  'dropSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, align: 'right' },
  'endSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, align: 'center' },
  'faceSection.js': { origX: 26, origY: 0, origZ: 0, origRotX: 0, origRotY: -0.4, align: 'left' },
  'flowSection.js': { origX: 0, origY: 0, origZ: -10, origRotX: 0, origRotY: 0.4, align: 'center' },
  'galaxySection.js': { origX: 0, origY: 20, origZ: -20, origRotX: 0, origRotY: 0, align: 'center' },
  'heightSection.js': { origX: -20, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, align: 'right' },
  'rocksSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, align: 'center' },
  'waveSection.js': { origX: 0, origY: 10, origZ: 0, origRotX: 0.2, origRotY: 0, align: 'center' }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const sectionName = filename.replace('.js', '');

  let mobileX = 0;
  if (pos.align === 'left') mobileX = -6;
  if (pos.align === 'right') mobileX = 6;
  
  // Safe desktop anchoring
  let targetX = 0;
  if (pos.align === 'left') targetX = -2;
  if (pos.align === 'right') targetX = 2;

  // Use a reasonable Y for mobile so it stays on screen
  // If original Y is already high (like 20), keep it. Otherwise push it up moderately (12)
  let mobileY = pos.origY > 10 ? pos.origY : 12;

  const newFunction = `function updateTextPosition () {
  var w = window.innerWidth;
  
  if (w <= 900) {
    // Shrunk text slightly on mobile so it doesn't overflow
    var s = Math.max(0.55, w / 1200);
    text.el.scale.set(s, s, s);
    
    text.el.position.x = ${mobileX};
    text.el.position.y = ${mobileY};
    text.el.position.z = ${pos.origZ};
    text.el.rotation.x = 0;
    text.el.rotation.y = 0;
  } else {
    var f = w / 1920;
    var s = Math.max(0.45, Math.min(1.2, f));
    text.el.scale.set(s, s, s);
    
    var progress = Math.max(0, Math.min(1, (1920 - w) / 1020));
    var safeX = ${pos.origX} + (${targetX} - ${pos.origX}) * progress;
    
    text.el.position.x = safeX;
    text.el.position.y = ${pos.origY} * f;
    text.el.position.z = ${pos.origZ}; 
    text.el.rotation.x = ${pos.origRotX};
    text.el.rotation.y = ${pos.origRotY};
  }
}
updateTextPosition();
window.addEventListener('resize', updateTextPosition);`;

  const existingFuncRegex = /function\s+updateTextPosition\s*\(\)\s*\{[\s\S]*?window\.addEventListener\('resize',\s*updateTextPosition\);/;

  if (existingFuncRegex.test(content)) {
    content = content.replace(existingFuncRegex, newFunction);
  } else {
    content = content.replace(/text\.el\.position\.set\([^)]+\);/g, '');
    content = content.replace(/text\.el\.position\.[xyz]\s*=\s*[^;]+;/g, '');
    content = content.replace(/text\.el\.rotation\.[xyz]\s*=\s*[^;]+;/g, '');
    content = content.replace(/text\.el\.scale\.set\([^)]+\);/g, '');
    
    const addRegex = new RegExp(sectionName + '\\\\.add\\\\(text\\\\.el\\\\);');
    if (addRegex.test(content)) {
      content = content.replace(addRegex, newFunction + '\n' + sectionName + '.add(text.el);');
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ' + filename);
}
