const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

const sections = {
  'ballSection.js': { origX: 15, origY: 0, origZ: 15, origRotX: 0, origRotY: -0.4, mobileX: -6, selector: '.heads__section--ball', planetRadius: 0 },
  'beamsSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, selector: '.heads__section--beams', planetRadius: 0 },
  'dropSection.js': { origX: -10, origY: 8, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, selector: '.heads__section--drop', planetRadius: 0 },
  'endSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0, selector: '.heads__section--end', planetRadius: 0 },
  'faceSection.js': { origX: 26, origY: 0, origZ: 0, origRotX: 0, origRotY: -0.4, mobileX: -6, selector: '.heads__section--face', planetRadius: 0 },
  'flowSection.js': { origX: 0, origY: 0, origZ: -10, origRotX: 0, origRotY: 0.4, mobileX: 0, selector: '.heads__section--flow', planetRadius: 0 },
  'galaxySection.js': { origX: -20, origY: 20, origZ: 0, origRotX: 0, origRotY: 0.2, mobileX: -10, selector: '.heads__section--galaxy', planetRadius: 15 },
  'heightSection.js': { origX: -20, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 6, selector: '.heads__section--height', planetRadius: 0 },
  'rocksSection.js': { origX: 0, origY: 0, origZ: 0, origRotX: 0, origRotY: 0, mobileX: 0, selector: '.heads__section--rocks', planetRadius: 0 },
  'waveSection.js': { origX: 0, origY: 10, origZ: 0, origRotX: 0.2, origRotY: 0, mobileX: 0, selector: '.heads__section--wave', planetRadius: 0 }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const sectionName = filename.replace('.js', '');

  const newFunction = `function updateTextPosition () {
  if (!text || !text.el) return;
  var w = window.innerWidth;
  var h = Math.max(window.innerHeight, 1);
  var aspect = w / h;
  
  if (w <= 900) {
    var s = Math.max(0.40, w / 1200);
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

    // 3. Find EXACT pixel bounding box of the HTML card on the screen!
    var cardEl = document.querySelector('${pos.selector} .section__card');
    var isLeftCard = ${pos.origX} > 0;
    var isRightCard = ${pos.origX} < 0;
    var isCenter = ${pos.origX} === 0;
    
    var leftBoundary3D = -E;
    var rightBoundary3D = E;

    if (cardEl) {
      var rect = cardEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        var rectLeft3D = ((rect.left / w) * W_3D) - E;
        var rectRight3D = ((rect.right / w) * W_3D) - E;
        
        var buffer3D = (120 / w) * W_3D; 
        
        if (isLeftCard) {
          leftBoundary3D = Math.max(-E, rectRight3D + buffer3D);
        } else if (isRightCard) {
          rightBoundary3D = Math.min(E, rectLeft3D - buffer3D);
        }
      }
      
      // Observe card size changes (e.g. expanding detail view)
      if (!cardEl._hasTextRo && window.ResizeObserver) {
        var ro = new ResizeObserver(function() { updateTextPosition(); });
        ro.observe(cardEl);
        cardEl._hasTextRo = true;
      }
    }

    // Add screen edge padding (approx 50px)
    var edgePadding3D = (50 / w) * W_3D;
    leftBoundary3D = Math.max(-E + edgePadding3D, leftBoundary3D);
    rightBoundary3D = Math.min(E - edgePadding3D, rightBoundary3D);

    // Planet avoidance logic
    var planetRadius = ${pos.planetRadius};
    if (planetRadius > 0) {
      var planetBuffer = 3; 
      if (isLeftCard) {
        leftBoundary3D = Math.max(leftBoundary3D, planetRadius + planetBuffer);
      } else if (isRightCard) {
        rightBoundary3D = Math.min(rightBoundary3D, -planetRadius - planetBuffer);
      }
    }

    // 4. Calculate the mathematically perfect center and width of the empty space
    var safeSpaceWidth = Math.max(0.1, rightBoundary3D - leftBoundary3D);
    var trueCenter = (leftBoundary3D + rightBoundary3D) / 2;

    if (isCenter) trueCenter = 0;

    // 5. Calculate REQUIRED scale to fit exactly within safe space
    var actualTextWidth = text.width3D || 25; 
    var cosRot = Math.abs(Math.cos(${pos.origRotY}));
    var apparentTextWidth = actualTextWidth * cosRot;
    
    var requiredS = safeSpaceWidth / apparentTextWidth;
    
    // 6. Set X position and Scale (ALWAYS use dynamic trueCenter)
    var safeX = isCenter ? 0 : trueCenter;
    
    var f = w / 1920;
    var designerS = Math.max(0.25, Math.pow(f, 1.2));
    
    var finalS = Math.min(designerS, requiredS);

    text.el.scale.set(finalS, finalS, finalS);
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
    
    const addString = sectionName + '.add(text.el);';
    if (content.includes(addString)) {
      content = content.replace(addString, newFunction + '\n' + addString);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ' + filename);
}
