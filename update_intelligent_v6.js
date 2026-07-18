const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const sections = {
  'ballSection.js': { origX: 15, origY: 0, origZ: 15, origRotX: 0, origRotY: -0.4, mobileX: -6, targetX: 4 },
  'beamsSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, targetX: -4 },
  'dropSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, targetX: -4 },
  'endSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0, targetX: 0 },
  'faceSection.js': { origX: 26, origY: 0, origZ: 0, origRotX: 0, origRotY: -0.4, mobileX: -6, targetX: 4 },
  'flowSection.js': { origX: 0, origY: 0, origZ: -10, origRotX: 0, origRotY: 0.4, mobileX: 0, targetX: 0 },
  'galaxySection.js': { origX: 0, origY: 20, origZ: -20, origRotX: 0, origRotY: 0, mobileX: 0, targetX: -10 },
  'heightSection.js': { origX: -20, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, targetX: -4 },
  'rocksSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0, targetX: 0 },
  'waveSection.js': { origX: 0, origY: 10, origZ: 0, origRotX: 0.2, origRotY: 0, mobileX: 0, targetX: 0 }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const sectionName = filename.replace('.js', '');

  const newFunction = `function updateTextPosition () {
  var w = window.innerWidth;
  
  if (w <= 900) {
    var s = Math.max(0.55, w / 1200);
    text.el.scale.set(s, s, s);
    
    text.el.position.x = ${pos.mobileX};
    text.el.position.y = ${pos.origY};
    text.el.position.z = ${pos.origZ};
    text.el.rotation.x = 0;
    text.el.rotation.y = 0;
  } else {
    var f = w / 1920;
    var s = Math.max(0.45, Math.min(1.2, f));
    text.el.scale.set(s, s, s);
    
    var progress = Math.max(0, Math.min(1, (1920 - w) / 1020));
    var safeX = ${pos.origX} + (${pos.targetX} - ${pos.origX}) * progress;
    
    text.el.position.x = safeX;
    // CRITICAL FIX: Do NOT scale Y proportionally. 
    // The vertical camera FOV is fixed, so Y coordinates do not change relative screen position on different widths.
    // Scaling Y down caused the text to drop behind 3D models like the galaxy!
    text.el.position.y = ${pos.origY};
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
