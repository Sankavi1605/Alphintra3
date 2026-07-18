const fs = require('fs');
const path = require('path');

const sectionsDir = path.join('c:', 'Users', 'User', 'OneDrive', 'Documents', 'alp', 'Alphintra3', 'app', 'src', 'js', 'sections');

// mobileX is chosen based on align: left (-10), center (0), right (10)
const sections = {
  'ballSection.js': { x: 15, y: 0, z: 15, rotX: 0, rotY: -0.4, mobileX: -10, align: 'left' },
  'beamsSection.js': { x: -10, y: 8, z: 0, rotX: 0, rotY: 0, mobileX: 10, align: 'right' },
  'dropSection.js': { x: -10, y: 8, z: 0, rotX: 0, rotY: 0, mobileX: 10, align: 'right' },
  'endSection.js': { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, mobileX: 0, align: 'center' },
  'faceSection.js': { x: 26, y: 0, z: 0, rotX: 0, rotY: -0.4, mobileX: -10, align: 'left' },
  'flowSection.js': { x: 0, y: 0, z: -10, rotX: 0, rotY: 0.4, mobileX: 0, align: 'center' },
  'galaxySection.js': { x: 0, y: 20, z: -20, rotX: 0, rotY: 0, mobileX: 0, align: 'center' },
  'heightSection.js': { x: -20, y: 0, z: 0, rotX: 0, rotY: 0, mobileX: 10, align: 'right' },
  'rocksSection.js': { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, mobileX: 0, align: 'center' },
  'waveSection.js': { x: 0, y: 10, z: 0, rotX: 0.2, rotY: 0, mobileX: 0, align: 'center' }
};

for (const [filename, pos] of Object.entries(sections)) {
  const filePath = path.join(sectionsDir, filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  const newFunction = `function updateTextPosition () {
  var w = window.innerWidth;
  var s;
  if (w <= 600) {
    s = 0.65;
  } else if (w <= 900) {
    s = 0.75;
  } else {
    s = Math.max(0.8, Math.min(1, w / 1600));
  }
  
  text.el.scale.set(s, s, s);

  if (w <= 900) {
    text.el.position.x = ${pos.mobileX};
    text.el.position.y = 20;
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

  const startIdx = content.indexOf('function updateTextPosition');
  const endMarker = "window.addEventListener('resize', updateTextPosition);";
  const endIdx = content.indexOf(endMarker) + endMarker.length;

  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newFunction + content.substring(endIdx);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filename);
  }
}
