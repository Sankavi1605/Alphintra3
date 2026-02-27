'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var HeightMap = require('../objects3D/HeightMapObject3D');

var heightSection = new Section('height');

var heightMap = new HeightMap({
  horizontal: true,
  vertical: false,
  plane: false,
  points: false,
  maps: [
    { name: 'A', url: './app/public/img/heightMap-A.jpg' },
    { name: 'B', url: './app/public/img/heightMap-B.jpg' },
    { name: 'O', url: './app/public/img/heightMap-O.jpg' }
  ]
});
heightMap.el.position.z = -10;
heightMap.el.rotation.y = -0.6;
heightSection.add(heightMap.el);

var text = new TextPanel(
  'E  N  T  E  R  P  R  I  S  E \n B  A  C  K  E  N  D',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40,
  }
);
text.el.position.set(-20, 0, 0);

function updateTextPosition () {
  if (window.innerWidth <= 900) {
    text.el.position.x = -8;
    text.el.position.z = 6;
    text.el.scale.set(0.82, 0.82, 0.82);
    return;
  }

  text.el.position.x = -20;
  text.el.position.z = 0;
  text.el.scale.set(1, 1, 1);
}

updateTextPosition();
window.addEventListener('resize', updateTextPosition);

heightSection.add(text.el);

heightMap.el.visible = false;

heightSection.onIn(function () {
  text.in();
});

heightSection.onOut(function (way) {
  text.out(way);
});

heightSection.onStart(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.start();
});

heightSection.onStop(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.stop();
});

heightSection.show = function () {
  heightMap.el.visible = true;
};

heightSection.hide = function () {
  heightMap.el.visible = false;
};

module.exports = heightSection;
