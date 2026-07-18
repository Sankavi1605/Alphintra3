'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Rocks = require('../objects3D/RocksObject3D');

var rocksSection = new Section('rocks');

var rocks = new Rocks();
rocksSection.add(rocks.el);

var text = new TextPanel(
  'A  L  P  H  I  N  T  R  A \n W  A  Y',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);

function updateTextPosition () {
  if (!text || !text.el) return;
  var w = window.innerWidth;
  var h = Math.max(window.innerHeight, 1);
  var aspect = w / h;
  
  if (w <= 900) {
    var s = Math.max(0.40, w / 1200);
    text.el.scale.set(s, s, s);
    text.el.position.x = 0;
    text.el.position.y = 0;
    text.el.position.z = 0;
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
    var textZ = 0;
    var dist = targetCameraZ - textZ;
    var vFov = targetFov * Math.PI / 180;
    var H_3D = 2 * Math.tan(vFov / 2) * dist;
    var W_3D = H_3D * aspect;
    var E = W_3D / 2;

    // 3. Find EXACT pixel bounding box of the HTML card on the screen!
    var cardEl = document.querySelector('.heads__section--rocks .section__card');
    var isLeftCard = 0 > 0;
    var isRightCard = 0 < 0;
    var isCenter = 0 === 0;
    
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
    var planetRadius = 0;
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
    var cosRot = Math.abs(Math.cos(0));
    var apparentTextWidth = actualTextWidth * cosRot;
    
    var requiredS = safeSpaceWidth / apparentTextWidth;
    
    // 6. Set X position and Scale (ALWAYS use dynamic trueCenter)
    var safeX = isCenter ? 0 : trueCenter;
    
    var f = w / 1920;
    var designerS = Math.max(0.25, Math.pow(f, 1.2));
    
    var finalS = Math.min(designerS, requiredS);

    text.el.scale.set(finalS, finalS, finalS);
    text.el.position.x = safeX;
    text.el.position.y = 0;
    text.el.position.z = 0; 
    text.el.rotation.x = 0;
    text.el.rotation.y = 0;
  }
}
updateTextPosition();
window.addEventListener('resize', updateTextPosition);
rocksSection.add(text.el);
text.out('down');

rocks.el.visible = false;

rocksSection.onIn(function () {
  text.in();
  rocks.in();
});

rocksSection.onOut(function (way) {
  text.out('down');
  rocks.out(way);
});

rocksSection.onStart(function () {
  rocks.start();
});

rocksSection.onStop(function () {
  rocks.stop();
});

rocksSection.show = function () {
  rocks.el.visible = true;
};

rocksSection.hide = function () {
  rocks.el.visible = false;
};

module.exports = rocksSection;
