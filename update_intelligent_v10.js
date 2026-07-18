const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const sections = {
  'ballSection.js': { origX: 15, origY: 0, origZ: 15, origRotX: 0, origRotY: -0.4, mobileX: -6 },
  'beamsSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6 },
  'dropSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6 },
  'endSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0 },
  'faceSection.js': { origX: 26, origY: 0, origZ: 0, origRotX: 0, origRotY: -0.4, mobileX: -6 },
  'flowSection.js': { origX: 0, origY: 0, origZ: -10, origRotX: 0, origRotY: 0.4, mobileX: 0 },
  'galaxySection.js': { origX: 0, origY: 20, origZ: -20, origRotX: 0, origRotY: 0, mobileX: 0 },
  'heightSection.js': { origX: -20, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6 },
  'rocksSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0 },
  'waveSection.js': { origX: 0, origY: 10, origZ: 0, origRotX: 0.2, origRotY: 0, mobileX: 0 }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const sectionName = filename.replace('.js', '');

  const newFunction = `function updateTextPosition () {
  var w = window.innerWidth;
  var h = Math.max(window.innerHeight, 1);
  var aspect = w / h;
  
  if (w <= 900) {
    var s = Math.max(0.55, w / 1200);
    text.el.scale.set(s, s, s);
    
    text.el.position.x = ${pos.mobileX};
    text.el.position.y = ${pos.origY};
    text.el.position.z = ${pos.origZ};
    text.el.rotation.x = 0;
    text.el.rotation.y = 0;
  } else {
    // 1. Replicate sceneModule.js Camera FOV Logic
    var targetFov = 60;
    var targetCameraZ = 40;
    if (aspect < 0.5) { targetFov = 90; targetCameraZ = 58; }
    else if (aspect < 0.62) { targetFov = 84; targetCameraZ = 54; }
    else if (aspect < 0.72) { targetFov = 78; targetCameraZ = 50; }
    else if (aspect < 0.88) { targetFov = 72; targetCameraZ = 46; }
    else if (aspect < 1.0) { targetFov = 66; targetCameraZ = 42; }

    // 2. Calculate true 3D screen edges at the text's Z-depth
    var textZ = ${pos.origZ};
    var dist = targetCameraZ - textZ;
    var vFov = targetFov * Math.PI / 180;
    var H_3D = 2 * Math.tan(vFov / 2) * dist;
    var W_3D = H_3D * aspect;
    var E = W_3D / 2;

    // 3. Calculate true 3D position of the HTML card
    var cardWidthPx = Math.min(450, w * 0.9);
    var cardWidth3D = (cardWidthPx / w) * W_3D;
    
    var isLeftCard = ${pos.origX} > 0;
    var isRightCard = ${pos.origX} < 0;
    var isCenter = ${pos.origX} === 0;

    // 4. Find the perfect mathematical center of the empty space
    var trueCenter = 0;
    if (isLeftCard) {
      var C = -E + cardWidth3D; // Right edge of left card
      trueCenter = (C + E) / 2;
    } else if (isRightCard) {
      var C = E - cardWidth3D; // Left edge of right card
      trueCenter = (-E + C) / 2;
    }

    // 5. Interpolate from designer's original X (at 1920px) to trueCenter (at narrow widths)
    var progress = Math.max(0, Math.min(1, (1920 - w) / 900));
    var safeX = isCenter ? 0 : ${pos.origX} + (trueCenter - ${pos.origX}) * progress;
    
    // 6. Apply scale and position
    var f = w / 1920;
    var s = Math.max(0.30, Math.pow(f, 1.2)); // Safe non-linear scaling
    text.el.scale.set(s, s, s);
    
    text.el.position.x = safeX;
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
